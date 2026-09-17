export const beneficiaries = [
  { id: "moi", label: "Moi-même" },
  { id: "enfant", label: "Mon enfant" },
  { id: "fille-ado", label: "Ma fille / adolescente" },
  { id: "famille", label: "Un autre membre de ma famille" },
] as const;

export const ageRanges = [
  { id: "under-3", label: "Moins de 3 ans" },
  { id: "3-6", label: "3 à 6 ans" },
  { id: "7-12", label: "7 à 12 ans" },
  { id: "13-17", label: "13 à 17 ans" },
  { id: "18-24", label: "18 à 24 ans" },
  { id: "25-34", label: "25 à 34 ans" },
  { id: "35-44", label: "35 à 44 ans" },
  { id: "45-54", label: "45 à 54 ans" },
  { id: "55-plus", label: "55 ans et plus" },
] as const;

export const sexes = [
  { id: "fille-femme", label: "Fille / Femme" },
  { id: "garcon-homme", label: "Garçon / Homme" },
] as const;

export const guardianRoles = [
  { id: "parent", label: "Parent" },
  { id: "tuteur", label: "Tuteur / Tutrice" },
  { id: "autre", label: "Autre responsable" },
] as const;

export const weightGoals = [
  { id: "aucun", label: "Aucun objectif de poids" },
  { id: "croissance", label: "Accompagner une croissance harmonieuse" },
  { id: "prendre", label: "Prendre du poids / améliorer les apports" },
  { id: "perdre", label: "Perdre du poids de façon adaptée" },
  { id: "stabiliser", label: "Stabiliser le poids" },
  { id: "qualite", label: "Je souhaite surtout améliorer la qualité de l'alimentation" },
] as const;

export const mainGoals = [
  { id: "mieux-manger", label: "Mieux manger au quotidien" },
  { id: "energie", label: "Avoir plus d'énergie" },
  {
    id: "concentration",
    label: "Améliorer la concentration et les performances scolaires / professionnelles",
  },
  { id: "digestion", label: "Améliorer la digestion et réduire les ballonnements" },
  { id: "sucre", label: "Réduire le grignotage et les envies de sucre" },
  { id: "sommeil", label: "Améliorer le sommeil" },
  { id: "sport", label: "Accompagner une activité sportive" },
  { id: "perdre-poids", label: "Perdre du poids progressivement" },
  { id: "prendre-poids", label: "Prendre du poids / favoriser de meilleurs apports" },
  { id: "croissance-enfant", label: "Accompagner la croissance de l'enfant" },
  { id: "preparer-grossesse", label: "Préparer une grossesse" },
  { id: "accompagner-grossesse", label: "Accompagner la grossesse" },
  { id: "post-partum", label: "Récupérer après l'accouchement" },
  { id: "allaitement", label: "Soutenir l'alimentation pendant l'allaitement" },
  { id: "famille", label: "Mieux organiser les repas de toute la famille" },
] as const;

export const mealCounts = [
  { id: "1-2", label: "1 à 2 repas" },
  { id: "3", label: "3 repas" },
  { id: "3-plus-collations", label: "3 repas + 1 à 2 collations" },
  { id: "variable", label: "Les horaires changent beaucoup d'un jour à l'autre" },
] as const;

export const breakfastHabits = [
  { id: "oui", label: "Oui, presque tous les jours" },
  { id: "parfois", label: "Parfois" },
  { id: "rarement", label: "Rarement / jamais" },
  { id: "selon-age", label: "Cela dépend de l'âge ou du rythme scolaire" },
] as const;

export const cravingMoments = [
  { id: "matin", label: "Matin" },
  { id: "apres-midi", label: "Après-midi" },
  { id: "apres-ecole-travail", label: "Après l'école / après le travail" },
  { id: "soir", label: "Après le dîner / le soir" },
  { id: "stress-ennui", label: "Pendant les périodes de stress ou d'ennui" },
  { id: "peu", label: "Peu ou pas de grignotage" },
] as const;

export const fruitVegPlaces = [
  { id: "chaque-repas", label: "À presque chaque repas" },
  { id: "1-2-jour", label: "1 à 2 fois par jour" },
  { id: "quelques-semaine", label: "Quelques fois par semaine" },
  { id: "rarement", label: "Très rarement" },
] as const;

export const sweetProcessedFreqs = [
  { id: "rarement", label: "Rarement" },
  { id: "quelques-semaine", label: "Quelques fois par semaine" },
  { id: "presque-tous-jours", label: "Presque tous les jours" },
  { id: "plusieurs-jour", label: "Plusieurs fois par jour" },
] as const;

export const foodRefusals = [
  { id: "non", label: "Non" },
  { id: "quelques", label: "Oui, quelques aliments" },
  { id: "beaucoup", label: "Oui, beaucoup d'aliments / alimentation très sélective" },
  { id: "legumes", label: "Oui, surtout les légumes" },
  { id: "textures", label: "Oui, surtout les textures / odeurs" },
] as const;

export const dietModes = [
  { id: "omnivore", label: "Omnivore" },
  { id: "flexitarien", label: "Flexitarien" },
  { id: "vegetarien", label: "Végétarien" },
  { id: "autre", label: "Autre" },
] as const;

export const allergies = [
  { id: "aucune", label: "Aucune" },
  { id: "lait", label: "Lait / produits laitiers" },
  { id: "gluten", label: "Gluten / maladie cœliaque" },
  { id: "oeuf", label: "Œuf" },
  { id: "fruits-coque", label: "Fruits à coque / arachides" },
  { id: "autre", label: "Autre" },
] as const;

export const likedFoods = [
  { id: "feculents", label: "Féculents / céréales" },
  { id: "viandes", label: "Viandes / volaille" },
  { id: "poissons", label: "Poissons" },
  { id: "legumineuses", label: "Légumineuses" },
  { id: "fruits", label: "Fruits" },
  { id: "legumes", label: "Légumes" },
  { id: "laitiers", label: "Produits laitiers ou alternatives" },
  { id: "traditionnels", label: "Plats traditionnels / cuisine familiale" },
] as const;

export const culturalConstraints = [
  { id: "non", label: "Non" },
  { id: "oui", label: "Oui" },
] as const;

export const digestionOptions = [
  { id: "bonne", label: "Bonne, sans problème particulier" },
  { id: "ballonnements", label: "Ballonnements fréquents" },
  { id: "constipation", label: "Constipation / transit lent" },
  { id: "diarrhee", label: "Diarrhée / transit irrégulier" },
  { id: "reflux", label: "Reflux / brûlures" },
  { id: "douleurs", label: "Douleurs ou inconforts digestifs fréquents" },
] as const;

export const energyLevels = [
  { id: "stable", label: "Stable" },
  { id: "fatigue-matin", label: "Fatigue surtout le matin" },
  { id: "fatigue-apres-midi", label: "Coup de fatigue dans l'après-midi" },
  { id: "fatigue-frequente", label: "Fatigue fréquente" },
  { id: "variable", label: "Énergie très variable" },
] as const;

export const sleepStates = [
  { id: "bon", label: "Bon et réparateur" },
  { id: "endormissement", label: "Difficulté à s'endormir" },
  { id: "reveils", label: "Réveils fréquents" },
  { id: "insuffisant", label: "Sommeil insuffisant" },
  { id: "irregulier", label: "Horaires très irréguliers" },
] as const;

export const activityLevels = [
  { id: "tres-faible", label: "Très faible / principalement assis" },
  { id: "leger", label: "Légèrement actif" },
  { id: "actif", label: "Actif plusieurs fois par semaine" },
  { id: "tres-actif", label: "Très actif / sport régulier" },
  { id: "competition", label: "Sport de compétition" },
] as const;

export const cookingTimes = [
  { id: "moins-15", label: "Moins de 15 minutes" },
  { id: "15-30", label: "15 à 30 minutes" },
  { id: "30-45", label: "30 à 45 minutes" },
  { id: "plus-45", label: "Plus de 45 minutes" },
  { id: "batch-cooking", label: "Je préfère préparer à l'avance / batch cooking" },
] as const;

export const mealPlaces = [
  { id: "maison", label: "À la maison" },
  { id: "ecole", label: "À l'école / cantine" },
  { id: "travail", label: "Au travail" },
  { id: "exterieur", label: "À l'extérieur" },
  { id: "mixte", label: "Mixte" },
] as const;

export const foodBudgets = [
  { id: "moins-3000", label: "Moins de 3 000 DA / semaine" },
  { id: "3000-6000", label: "3 000 à 6 000 DA / semaine" },
  { id: "6000-10000", label: "6 000 à 10 000 DA / semaine" },
  { id: "plus-10000", label: "Plus de 10 000 DA / semaine" },
  { id: "non-precise", label: "Je préfère ne pas indiquer de budget précis" },
] as const;

export const healthConditions = [
  { id: "aucune", label: "Aucune" },
  { id: "anemie", label: "Anémie / carence en fer" },
  { id: "thyroide", label: "Trouble thyroïdien" },
  { id: "diabete", label: "Diabète / prédiabète" },
  { id: "cholesterol", label: "Cholestérol / triglycérides élevés" },
  { id: "digestifs", label: "Troubles digestifs diagnostiqués" },
  { id: "allergies", label: "Allergies importantes" },
  { id: "autre", label: "Autre" },
] as const;

export const treatmentOptions = [
  { id: "non", label: "Non" },
  { id: "oui", label: "Oui" },
] as const;

export const womenSituations = [
  { id: "aucune", label: "Pas de situation particulière" },
  { id: "adolescence", label: "Adolescence / puberté" },
  { id: "projet-grossesse", label: "Projet de grossesse" },
  { id: "grossesse", label: "Grossesse" },
  { id: "post-partum", label: "Post-partum" },
  { id: "allaitement", label: "Allaitement" },
  { id: "menopause", label: "Péri-ménopause / ménopause" },
  { id: "non-concernee", label: "Non concernée" },
] as const;

export const periodOptions = [
  { id: "regulieres", label: "Régulières et peu gênantes" },
  { id: "irregulieres", label: "Irrégulières" },
  { id: "douloureuses", label: "Très douloureuses" },
  { id: "abondantes", label: "Très abondantes" },
  { id: "fatigue-envies", label: "Associées à une forte fatigue / envies alimentaires" },
  { id: "non-concernee", label: "Je n'ai pas encore mes règles / Non concernée" },
] as const;

export const pregnancyDetails = [
  { id: "grossesse-t1", label: "Grossesse : 1er trimestre" },
  { id: "grossesse-t2", label: "Grossesse : 2e trimestre" },
  { id: "grossesse-t3", label: "Grossesse : 3e trimestre" },
  { id: "allaitement-exclusif", label: "Allaitement exclusif" },
  { id: "allaitement-mixte", label: "Allaitement mixte" },
  { id: "non-concernee", label: "Non concernée" },
] as const;

export const childIssues = [
  { id: "appetit-faible", label: "Appétit très faible" },
  { id: "appetit-fort", label: "Appétit très important" },
  { id: "selectivite", label: "Sélectivité alimentaire" },
  { id: "refus-legumes", label: "Refus de légumes / fruits" },
  { id: "grignotage", label: "Grignotage fréquent" },
  { id: "textures", label: "Difficulté avec les textures" },
  { id: "aucun", label: "Aucun problème particulier" },
] as const;

export const schoolInfluences = [
  { id: "non", label: "Non" },
  { id: "petit-dejeuner", label: "Oui, petit-déjeuner difficile" },
  { id: "cantine", label: "Oui, déjeuner à la cantine" },
  { id: "gouter", label: "Oui, goûter très important" },
  { id: "sport", label: "Oui, sport / activités après l'école" },
  { id: "irregulier", label: "Oui, horaires très irréguliers" },
] as const;

export const stressLevels = [
  { id: "faible", label: "Faible" },
  { id: "modere", label: "Modéré" },
  { id: "eleve", label: "Élevé" },
  { id: "tres-eleve", label: "Très élevé" },
] as const;

export const accompanimentTypes = [
  { id: "menus-famille", label: "Menus simples pour toute la famille" },
  { id: "programme-individuel", label: "Programme individuel détaillé" },
  { id: "recettes-rapides", label: "Recettes rapides" },
  { id: "idees-repas", label: "Idées de repas et collations" },
  { id: "liste-courses", label: "Liste de courses" },
  { id: "batch-cooking", label: "Organisation / batch cooking" },
  { id: "conseils-enfant", label: "Conseils pour enfant / adolescente" },
  { id: "suivi", label: "Suivi et motivation" },
] as const;

export const PROFILE_ORIENTATION =
  "Les réponses permettent d'orienter le bilan vers le profil le plus adapté : Enfant & Croissance • Adolescente • Femme Active • Maman & Famille • Grossesse & Allaitement • Énergie & Équilibre alimentaire • Confort Digestif • Sport & Performance • Organisation familiale.";

export const MEDICAL_REMARK =
  "Remarque : les recommandations nutritionnelles personnalisées doivent tenir compte de l'âge, du contexte et, lorsqu'une pathologie ou un traitement est présent, des recommandations du professionnel de santé.";
