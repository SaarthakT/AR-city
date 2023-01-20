AFRAME.registerComponent("createModels", {
  init: async function () {

    //Get the compund details of the element
    var models = await this.getModels();

    var barcodes = Object.keys(models);

    barcodes.map(barcode => {
      var element = models[barcode];

      //Call the function
      this.createModels(element);
    });

  },
  getModels: function () {
    return fetch("js/model.json")
      .then(res => res.json())
      .then(data => data);
  },

  createModels: async function (element) {

    //Element data
    var elementName = element.element_name;
    var barcodeValue = element.barcode_value;
    var numOfElectron = element.number_of_electron;

    //Scene
    var scene = document.querySelector("a-scene");

    //Add marker entity for BARCODE marker
    var marker = document.createElement("a-marker");

    marker.setAttribute("id", `marker-${barcodeValue}`);
    marker.setAttribute("type", "barcode");
    marker.setAttribute("element_name", elementName);
    marker.setAttribute("value", barcodeValue);

    scene.appendChild(marker);

    var atom = document.createElement("a-entity");
    atom.setAttribute("id", `${elementName}-${barcodeValue}`);
    marker.appendChild(atom);

    //Create atom card
    var card = document.createElement("a-entity");
    card.setAttribute("id", `card-${elementName}`);
    card.setAttribute("geometry", {
      primitive: "plane",
      width: 1,
      height: 1
    });

    card.setAttribute("material", {
      src: `./assets/atom_cards/card_${elementName}.png`
    });

    card.setAttribute("position", { x: 0, y: 0, z: 0 });
    card.setAttribute("rotation", { x: -90, y: 0, z: 0 });

    atom.appendChild(card);

    //Create modelEl
    var modelElRadius = 0.2;
    var modelEl = document.createElement("a-entity");
    modelEl.setAttribute("id", `modelEl-${elementName}`);
    modelEl.setAttribute("geometry", {
      primitive: "sphere",
      radius: modelElRadius
    });

    modelEl.setAttribute("material", "color", colors[elementName]);
    modelEl.setAttribute("position", { x: 0, y: 1, z: 0 });

    modelEl.setAttribute("rotation", { x: 0, y: 0, z: 0 });

    var modelElName = document.createElement("a-entity");
    modelElName.setAttribute("id", `modelEl-name-${elementName}`);
    modelElName.setAttribute("position", { x: 0, y: 0.21, z: -0.06 });
    modelElName.setAttribute("rotation", { x: -90, y: 0, z: 0 });
    modelElName.setAttribute("text", {
      font: "monoid",
      width: 3,
      color: "black",
      align: "center",
      value: elementName
    });

    modelEl.appendChild(modelElName);

    atom.appendChild(modelEl);

    var orbitAngle = -180;
    var electronAngle = 30;

    for (var num = 1; num <= numOfElectron; num++) {
      //Create orbit
      var orbit = document.createElement("a-entity");
      orbit.setAttribute("geometry", {
        primitive: "torus",
        arc: 360,
        radius: 0.28,
        radiusTubular: 0.001
      });

      orbit.setAttribute("material", {
        color: "#ff9e80",
        opacity: 0.3
      });

      orbit.setAttribute("position", {
        x: 0,
        y: 1,
        z: 0
      });

      orbit.setAttribute("rotation", {
        x: 0,
        y: orbitAngle,
        z: 0
      });

      orbitAngle += 45;

      atom.appendChild(orbit);

      //Create electron revolution animation entity
      var electronGroup = document.createElement("a-entity");
      electronGroup.setAttribute("id", `electron-group-${elementName}`);
      electronGroup.setAttribute("rotation", {
        x: 0,
        y: 0,
        z: electronAngle
      });

      electronAngle += 65;

      electronGroup.setAttribute("animation", {
        property: "rotation",
        to: `0 0 -360`,
        loop: "true",
        dur: 3500,
        easing: "linear"
      });

      orbit.appendChild(electronGroup);

      //Create electron
      var electron = document.createElement("a-entity");
      electron.setAttribute("id", `electron-${elementName}`);
      electron.setAttribute("geometry", {
        primitive: "sphere",
        radius: 0.02
      });

      electron.setAttribute("material", { color: "#0d47a1", opacity: 0.6 });
      electron.setAttribute("position", {
        x: 0.2,
        y: 0.2,
        z: 0
      });

      electronGroup.appendChild(electron);


    }
  }
});
