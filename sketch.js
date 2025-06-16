let seeds = [];
let waterCans = [];
let plants = [];
let fertilizerCans = [];
let score = 0;
let plantGrowthRate = 0.05;
let phaseTime = 30; // Limite de tempo por fase (em segundos)
let phaseCounter = phaseTime;
let gamePhase = 1; // Fase inicial

function setup() {
  createCanvas(600, 400);
  textSize(18);
  fill(0);
  textAlign(CENTER, TOP);
  frameRate(60); // Controla a taxa de atualização do jogo
  
  // Inicia o temporizador da fase
  setInterval(() => {
    if (phaseCounter > 0) phaseCounter--;
    else startNextPhase();
  }, 1000);
}

function draw() {
  background(200, 255, 200); // Cor do fundo (parecendo um jardim)
  
  // Exibir a pontuação e a fase
  displayStats();
  
  // Exibir tempo restante para a fase
  text(`Fase: ${gamePhase}`, width / 2, 50);
  text(`Tempo restante: ${phaseCounter}s`, width / 2, 80);

  // Atualizar e exibir sementes
  for (let i = seeds.length - 1; i >= 0; i--) {
    seeds[i].update();
    seeds[i].display();
    if (seeds[i].y <= height / 2) {
      // Quando a semente atinge o solo, ela vira uma planta
      let newPlant = new Plant(seeds[i].x, height / 2);
      plants.push(newPlant);
      seeds.splice(i, 1);
    }
  }

  // Atualizar e exibir plantas
  for (let i = plants.length - 1; i >= 0; i--) {
    plants[i].update();
    plants[i].display();
    if (plants[i].waterLevel <= 0) {
      // Se a planta não tem água, ela morre
      plants.splice(i, 1);
    }
  }

  // Exibir garrafas de água
  for (let i = waterCans.length - 1; i >= 0; i--) {
    waterCans[i].display();
    if (waterCans[i].isClicked()) {
      waterCans[i].waterPlants();
      waterCans.splice(i, 1);
    }
  }
  
  // Exibir fertilizantes
  for (let i = fertilizerCans.length - 1; i >= 0; i--) {
    fertilizerCans[i].display();
    if (fertilizerCans[i].isClicked()) {
      fertilizerCans[i].fertilizePlants();
      fertilizerCans.splice(i, 1);
    }
  }
}

// Função para clicar e plantar uma semente
function mousePressed() {
  if (mouseY > height / 2) {
    seeds.push(new Seed(mouseX, mouseY)); // Planta a semente
  }
}

// Função para regar as plantas
function keyPressed() {
  if (key === 'r' || key === 'R') {
    waterCans.push(new WaterCan(mouseX, mouseY)); // Adiciona uma garrafa de água
  }
  if (key === 'f' || key === 'F') {
    fertilizerCans.push(new FertilizerCan(mouseX, mouseY)); // Adiciona um fertilizante
  }
}

// Função para iniciar a próxima fase
function startNextPhase() {
  gamePhase++;
  phaseCounter = phaseTime; // Reseta o temporizador
  plantGrowthRate += 0.02; // Aumenta a taxa de crescimento das plantas
  // Nova fase, pode ter novos tipos de plantas, ou mais difíceis de cuidar.
  console.log(`Fase ${gamePhase} iniciada!`);
  // Podemos criar mais tipos de plantas ou obstáculos aqui.
}

// Função para exibir a pontuação e informações do jogo
function displayStats() {
  text("Pontuação: " + score, width / 2, 20);
}

// Classe para a semente
class Seed {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 10;
  }

  update() {
    this.y -= 2; // A semente sobe até atingir o solo
  }

  display() {
    fill(139, 69, 19); // Cor da semente
    ellipse(this.x, this.y, this.size);
  }
}

// Classe para a planta
class Plant {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 15;
    this.waterLevel = 100; // A planta começa com 100% de água
    this.growth = 0;
    this.type = random(['basic', 'fast', 'resilient']); // Tipos de plantas
  }

  update() {
    if (this.waterLevel > 0) {
      this.waterLevel -= 0.05; // A planta perde água lentamente
    }

    // Tipos de plantas têm características diferentes
    if (this.type === 'basic') {
      this.growth += plantGrowthRate;
    } else if (this.type === 'fast') {
      this.growth += plantGrowthRate * 1.5; // Cresce mais rápido
    } else if (this.type === 'resilient') {
      this.growth += plantGrowthRate * 0.8; // Cresce mais devagar, mas resiste a menos água
    }

    if (this.waterLevel <= 0 && this.type !== 'resilient') {
      // Se a planta não tem água e não for resiliente, morre
      this.growth -= 0.05; // A planta morre
    }

    if (this.growth >= 2) {
      // A planta atinge o seu tamanho máximo e o jogador ganha pontos
      score += 10;
      this.growth = 2; // Limita o tamanho da planta
    }
  }

  display() {
    // Cor da planta
    if (this.type === 'basic') fill(0, 128, 0);
    else if (this.type === 'fast') fill(0, 200, 0);
    else if (this.type === 'resilient') fill(34, 139, 34);
    
    ellipse(this.x, this.y - this.size, this.size + this.growth * 10, this.size + this.growth * 10);
  }

  // Método para verificar se a planta foi regada
  water() {
    if (this.waterLevel < 100) {
      this.waterLevel = 100; // Enche a planta de água
    }
  }
}

// Classe para a garrafa de água
class WaterCan {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 20;
  }

  display() {
    fill(0, 0, 255); // Cor da garrafa de água
    ellipse(this.x, this.y, this.size);
  }

  isClicked() {
    return dist(mouseX, mouseY, this.x, this.y) < this.size / 2;
  }

  waterPlants() {
    for (let plant of plants) {
      plant.water(); // Regar todas as plantas
    }
  }
}

// Classe para o fertilizante
class FertilizerCan {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 20;
  }

  display() {
    fill(255, 215, 0); // Cor do fertilizante (amarelo)
    ellipse(this.x, this.y, this.size);
  }

  isClicked() {
    return dist(mouseX, mouseY, this.x, this.y) < this.size / 2;
  }

  fertilizePlants() {
    for (let plant of plants) {
      plant.growth += 0.1; // Acelera o crescimento das plantas
    }
  }
}
