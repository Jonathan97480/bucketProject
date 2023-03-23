import { resetForm, fixedQuantity } from "./logic";

describe('resetForm function', () => {
    it('Retourne un formulaire vide par default quand on appelle cette function', () => {
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
    it('fixe la quantité a un si on lui envoi une chaîne de character vide ', () => {
        const expectedQuantity = "1";


        const quantity = fixedQuantity("");

        expect(quantity).toEqual(expectedQuantity);
    });
    it('fixe la quantité a un si on lui envoi une valeur négatifs', () => {
        const expectedQuantity = "1";


        const quantity = fixedQuantity("-1");

        expect(quantity).toEqual(expectedQuantity);
    });
});


