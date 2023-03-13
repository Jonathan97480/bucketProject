import { Image, StyleSheet } from "react-native";

const IconAutres_image = require(`./icons/Autres.png`);
const IconAlimentation_image = require(`./icons/Alimentation.png`);
const IconLoisir_image = require(`./icons/Loisirs.png`);
const IconSanté_image = require(`./icons/Santé.png`);
const Voiture_image = require(`./icons/Voiture.png`);
const IconVetement_image = require(`./icons/Vêtements.png`);
const IconLogement_image = require(`./icons/Logement.png`);
const IconBudgetEmpty_image = require(`./icons/BudgetEmpty.png`);
export const IconBudgetAdd_image = require(`./icons/BudgetAdd.png`);


export const IconAutres = () => {
    return <Image source={IconAutres_image} style={styles.icon}
    />
}

export const IconAlimentation = () => {
    return <Image source={IconAlimentation_image} style={styles.icon}
    />
}

export const IconLoisir = () => {
    return <Image source={IconLoisir_image} style={styles.icon}
    />
}

export const IconSanté = () => {
    return <Image source={IconSanté_image} style={styles.icon}
    />
}

export const IconVetement = () => {
    return <Image source={IconVetement_image} style={styles.icon}
    />

}

export const IconLogement = () => {
    return <Image source={IconLogement_image} style={styles.icon}
    />
}

export const IconBudgetEmpty = () => {
    return <Image source={IconBudgetEmpty_image} style={styles.icon}
    />
}

export const IconBudgetAdd = () => {
    return <Image source={IconBudgetAdd_image} style={styles.icon}
    />
}

export const Voiture = () => {
    return <Image source={Voiture_image} style={styles.icon}
    />
}

const styles = StyleSheet.create({

    icon: {
        width: 30,
        height: 30,
    }
});


