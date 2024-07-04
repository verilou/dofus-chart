# Dofus Chart

Dofus Chart est un projet innovant permettant de récupérer les derniers prix du marché des objets du serveur du jeu Dofus et de les visualiser sous forme de graphiques grâce à Metabase. Cet outil a été spécialement conçu pour les joueurs de Dofus souhaitant suivre l'évolution des prix des objets en temps réel pour optimiser leurs achats et ventes dans le jeu.

## Fonctionnalités

- **Scraping des prix :** Le script récupère automatiquement les derniers prix du marché des objets sur Dofus.
- **Stockage des données :** Les données collectées sont stockées dans une base de données structurée.
- **Visualisation des données :** Grâce à Metabase, les données sont transformées en graphiques et tableaux interactifs pour une analyse facile et rapide.
- **Mises à jour régulières :** Le scrapeur est configuré pour effectuer des mises à jour fréquentes afin de garantir des informations toujours à jour.

## Installation

Pour utiliser ce projet, suivez les étapes ci-dessous :

1. Clonez le dépôt sur votre machine locale :
    ```sh
    git clone https://github.com/verilou/dofus-chart.git
    ```

2. Naviguez dans le répertoire du projet :
    ```sh
    cd dofus-chart
    ```

3. Installez les dépendances requises :
    ```sh
    npm i
    ```

4. Configurez votre fichier de configuration avec les informations nécessaires (base de données, Metabase, etc.).

5. Lancez le scrapeur pour recueillir les données :
    ```sh
    pm2 start index.js
    ```

6. Accédez à Metabase pour visualiser les données :
    - Configurez Metabase avec votre base de données.
        - `run un container Metabase avec docker run -d -p 3000:3000 --name metabase metabase/metabase `
    - Créez des dashboards et des graphiques selon vos besoins.

## Configuration

Assurez-vous d'avoir configuré correctement les paramètres de connexion à la base de données et à Metabase. Les détails de configuration se trouvent dans le fichier `config.yaml`.

## Exemples

<img width="1110" alt="Capture d’écran 2024-07-04 à 20 58 13" src="https://github.com/verilou/dofus-chart/assets/32060637/bf8bc63f-57e5-43e9-8255-a1bf6e1a3312">


## Contribuer

Les contributions sont les bienvenues ! Vous pouvez participer en signalant des problèmes, en faisant des demandes de fonctionnalités ou en soumettant des pull requests.

## Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.

## Contact

Pour toute question ou suggestion, n'hésitez pas à ouvrir un ticket sur GitHub ou à me contacter directement via github.

---

Merci d'utiliser Dofus Chart et bonne analyse de marché !
