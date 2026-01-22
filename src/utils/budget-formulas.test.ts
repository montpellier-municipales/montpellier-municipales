import { describe, it, expect } from 'vitest';
import { evaluateFormula } from './budget-formulas';
import { BudgetType, BudgetSource } from '../types/budget';
import type { BudgetLine } from '../types/budget';

// Helper to create mock lines
const createLine = (overrides: Partial<BudgetLine>): BudgetLine => ({
  id: "test-id",
  type: BudgetType.Depense,
  budget: BudgetSource.Principal,
  nature_code: "000",
  nature_label: "Test",
  nature_chapitre: "000",
  montant_vote: 100,
  montant_realise: 100,
  operation_reelle: true,
  ...overrides
});

describe('evaluateFormula', () => {
  it('should correctly identify simple expenses (D)', () => {
    const line = createLine({ type: BudgetType.Depense });
    expect(evaluateFormula('D', line, 2025)).toBe(true);
  });

  it('should return false when checking Revenue (R) on an Expense line', () => {
    const line = createLine({ type: BudgetType.Depense });
    expect(evaluateFormula('R', line, 2025)).toBe(false);
  });

  it('should correctly match chapters (ChXX)', () => {
    const line = createLine({ nature_chapitre: '65' });
    expect(evaluateFormula('Ch65', line, 2025)).toBe(true);
    expect(evaluateFormula('Ch66', line, 2025)).toBe(false);
  });

  it('should correctly match nature codes (CXXXX)', () => {
    const line = createLine({ nature_code: '64111' });
    expect(evaluateFormula('C6411', line, 2025)).toBe(true); // Prefix match
    expect(evaluateFormula('C6412', line, 2025)).toBe(false);
  });

  it('should handle complex intersections (AND / ∩)', () => {
    // DF = Dépense de Fonctionnement. 
    // Assuming '65' is a defined Funcionnement chapter in the utility
    const line = createLine({ 
      type: BudgetType.Depense, 
      nature_chapitre: '65' 
    });
    expect(evaluateFormula('DF∩Ch65', line, 2025)).toBe(true);
  });

  it('should handle complex unions (OR / ∪)', () => {
    const line = createLine({ nature_chapitre: '66' });
    expect(evaluateFormula('Ch65∪Ch66', line, 2025)).toBe(true);
  });

  it('should handle nested formulas with parentheses', () => {
    const line = createLine({ 
      type: BudgetType.Depense, 
      nature_chapitre: '66' 
    });
    expect(evaluateFormula('DF∩(Ch65∪Ch66)', line, 2025)).toBe(true);
  });

  it('should return false if one part of intersection fails', () => {
    // 011 is Fonctionnement, but not Ch65
    const line = createLine({ 
      type: BudgetType.Depense, 
      nature_chapitre: '011' 
    });
    expect(evaluateFormula('DF∩Ch65', line, 2025)).toBe(false);
  });

  it('should correctly handle Year checks (AnnXXXX)', () => {
    const line = createLine({});
    expect(evaluateFormula('Ann2025', line, 2025)).toBe(true);
    expect(evaluateFormula('Ann2022', line, 2025)).toBe(false);
  });
  
  it('should handle null or empty formulas gracefully', () => {
     const line = createLine({});
     // Assuming empty formula allows everything or returns true (based on previous implementation logic)
     expect(evaluateFormula('', line, 2025)).toBe(true);
  });
});
