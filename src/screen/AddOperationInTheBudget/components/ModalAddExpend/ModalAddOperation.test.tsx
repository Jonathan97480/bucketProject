import { resetForm, fixedQuantity } from "./logic";

describe('resetForm function', () => {
    it('should return a FormAddBudget object with default values', () => {
        const expectedForm = {
            title: "",
            errorTitle: "",
            montant: "",
            errorMontant: "",
            category: 1,
            type: "expense",
            quantity: "",
            errorQuantity: "",
            btnEnabled: true,
        };

        const form = resetForm();

        expect(form).toEqual(expectedForm);
    });
});

describe('fixedQuantity function', () => {
    it('fixe la quantité a un si on lui envoi une chaîne de character vide  ou une valeur négatif', () => {
        const expectedQuantity = "1";


        const quantity = fixedQuantity("");

        expect(quantity).toEqual(expectedQuantity);
    });
});


