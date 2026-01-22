import { BudgetType, type BudgetLine } from "~/types/budget";

// Définition des chapitres par section (basée sur le fichier d'agrégation et la M57)
const F_CHAPTERS = ["011", "012", "014", "015", "016", "017", "022", "023", "042", "65", "66", "67", "68", "70", "73", "74", "75"];
const I_CHAPTERS = ["10", "13", "16", "20", "21", "23", "26", "27", "204", "001", "010", "018", "020", "021", "024", "040", "041", "45"];

export function evaluateFormula(formula: string, line: BudgetLine, contextYear: number): boolean {
    if (!formula) return true;

    try {
        const parser = new FormulaParser(formula, line, contextYear);
        return parser.parse();
    } catch (e) {
        console.error(`Error evaluating formula: ${formula}`, e);
        return false;
    }
}

class FormulaParser {
    tokens: string[];
    pos: number;
    line: BudgetLine;
    contextYear: number;

    constructor(formula: string, line: BudgetLine, contextYear: number) {
        // Normalisation et tokenization
        const normalized = formula
            .replace(/\s+/g, "") // Supprimer les espaces
            .replace(/\*/g, "∩") // Normaliser AND
            .replace(/\+/g, "∪"); // Normaliser OR
        
        // Decoupage par les opérateurs et parenthèses
        this.tokens = normalized.split(/([∩∪()])/).filter(t => t.length > 0);
        this.pos = 0;
        this.line = line;
        this.contextYear = contextYear;
    }

    parse(): boolean {
        const result = this.parseExpression();
        return result;
    }

    // Expression = Term { "∪" Term }
    private parseExpression(): boolean {
        let left = this.parseTerm();
        while (this.pos < this.tokens.length && this.tokens[this.pos] === "∪") {
            this.pos++; // consommer "∪"
            const right = this.parseTerm();
            left = left || right;
        }
        return left;
    }

    // Term = Factor { "∩" Factor }
    private parseTerm(): boolean {
        let left = this.parseFactor();
        while (this.pos < this.tokens.length && this.tokens[this.pos] === "∩") {
            this.pos++; // consommer "∩"
            const right = this.parseFactor();
            left = left && right;
        }
        return left;
    }

    // Factor = "(" Expression ")" | Atom
    private parseFactor(): boolean {
        if (this.pos >= this.tokens.length) return false;

        const token = this.tokens[this.pos];
        this.pos++;

        if (token === "(") {
            const result = this.parseExpression();
            if (this.pos < this.tokens.length && this.tokens[this.pos] === ")") {
                this.pos++; // consommer ")"
            }
            return result;
        }

        // C'est un atome
        return this.checkAtom(token);
    }

    private checkAtom(atom: string): boolean {
        return checkAtom(atom, this.line, this.contextYear);
    }
}

function checkAtom(atom: string, line: BudgetLine, contextYear: number): boolean {
    // 1. Macros complexes
    if (atom === "DF") return line.type === BudgetType.Depense && isFonctionnement(line);
    if (atom === "DI") return line.type === BudgetType.Depense && isInvestissement(line);
    if (atom === "RF") return line.type === BudgetType.Recette && isFonctionnement(line);
    if (atom === "RI") return line.type === BudgetType.Recette && isInvestissement(line);

    // 2. Types simples
    if (atom === "D") return line.type === BudgetType.Depense;
    if (atom === "R") return line.type === BudgetType.Recette;
    
    // 3. Sections (si utilisées seules)
    if (atom === "F") return isFonctionnement(line);
    if (atom === "I") return isInvestissement(line);

    // 4. Chapitres : Ch<XX>
    if (atom.startsWith("Ch")) {
        const chap = atom.substring(2);
        return line.nature_chapitre === chap;
    }

    // 5. Comptes Nature : C<XXXX> ou N<XXXX>
    if (atom.startsWith("C") || atom.startsWith("N")) {
        const code = atom.substring(1);
        // "N64111" -> match si le code nature commence par 64111
        return line.nature_code.startsWith(code);
    }

    // 6. Fonctions : F<XX>
    // Attention conflit avec "F" (Fonctionnement).
    // Mais "F" a longueur 1. "F4" longueur 2.
    // L'atome a été isolé, donc on teste juste la longueur
    if (atom.startsWith("F") && atom.length > 1) {
        const func = atom.substring(1);
        if (!line.fonction_code) return false;
        // On normalise le code fonction (enlève les points ou tirets éventuels)
        const cleanFunc = line.fonction_code.replace(/[^0-9]/g, "");
        return cleanFunc.startsWith(func);
    }

    // 7. Année : Ann<XXXX>
    if (atom.startsWith("Ann")) {
        const year = parseInt(atom.substring(3), 10);
        return contextYear === year;
    }

    // Par sécurité, si on ne connait pas l'atome
    return false;
}

function isFonctionnement(line: BudgetLine): boolean {
    return F_CHAPTERS.includes(line.nature_chapitre);
}

function isInvestissement(line: BudgetLine): boolean {
    return I_CHAPTERS.includes(line.nature_chapitre);
}