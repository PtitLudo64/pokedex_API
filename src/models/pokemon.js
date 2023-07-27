const validTypes = ['Acier', 'Combat', 'Dragon', 'Eau', 'Electrik', 'Fée', 'Feu', 'Glace', 'Insecte', 'Normal', 'Plante', 'Poison', 'Psy', 'Roche', 'Sol', 'Spectre', 'Ténèbres', 'Vol'];

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Pokemon', {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: {
          msg: "Le nom est déjà pris.",
        },
        validate: {
          notEmpty: {msg: "Le nom ne peut pas être vide."},
          notNull: {msg: "Le nom est requis."}
        }
      },
      hp: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: {msg: "Utilisez uniquement des nombres entiers."},
          notNull: {msg: "Les points de vie sont obligatoires."},
          min: {
            args: [0],
            msg: "Les points de vie doivent être supérieur ou égal à 0."
          },
          max: {
            args: [999],
            msg: "La valeur des CP doit être inférieur ou égal a 999"
          }
        }
      },
      cp: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: {msg: "Utilisez uniquement des nombres entiers."},
          notNull: {msg: "Les points de dégâts sont obligatoires."},
          min: {
            args: [0],
            msg: "Les points de dégâts doivent être supérieure ou égale à 0."
          },
          max: {
            args: [99],
            msg: "Les points de dégâts doivent être inférieure ou égale a 99"
          }
        }
      },
      picture: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isUrl: {msg: "Le chemin vers l'image doit être une URL valide."},
          notNull: {msg: "Le chemin vers l'image est obligatoire."}
        }
      },
      types: {
        type: DataTypes.STRING,
        allowNull: false,
        get() {
          return this.getDataValue('types').split(',');
        },
        set(types) {
          this.setDataValue('types', types);
        },
        validate: {
          isTypesValid(value) {
            if (!value) {
              throw new Error("Un Pokemon doit avoir au moins un type.");
            }
            if (value.split(',').length > 3) {
              throw new Error("Un Pokemon ne peux pas avoir plus de 3 types.");
            }
            value.split(',').forEach(type => {
              if(!validTypes.includes(type)) {
                throw new Error(`Le type '${type}' ne fait pas partie des type autorisés: ${validTypes}`);
              }
            });
          }
        }
      }
    }, {
      timestamps: true,
      createdAt: 'created',
      updatedAt: false
    })
  }