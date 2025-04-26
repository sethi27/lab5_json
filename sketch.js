/*
 *    - P5.js is included via CDN in index.html
 *    - Using P5.js functions: createCanvas(), setup(), draw()
 *    - Using localStorage to store and retrieve data:
 *      * localStorage.setItem() - Saves mood data
 *      * localStorage.getItem() - Retrieves saved mood
 *      * JSON.stringify() - Converts mood history to JSON
 *      * JSON.parse() - Converts JSON back to JavaScript object
 */

// Global variables for mood tracking and visualization
let currentMood = 'happy';  // Default mood
let moodHistory = [];       // Array to store mood history
let particles = [];         // For happy mood visualization
let waves = [];            // For sad mood visualization
let lines = [];            // For anxious mood visualization
let stars = [];            // For excited mood visualization

// P5.js setup function - runs once at the start
function setup() {
    // Create canvas that fills most of the window
    createCanvas(windowWidth, windowHeight - 100);
    
    // ===== LOCALSTORAGE: LOAD DATA =====
    // Load the last saved mood from localStorage
    // This demonstrates loading data from outside the sketch
    const savedMood = localStorage.getItem('mood');
    if (savedMood) {
        currentMood = savedMood;
        document.getElementById('moodSelect').value = savedMood;
    }
    
    // ===== JSON: LOAD DATA =====
    //  mood history from localStorage as JSON
    // This demonstrates loading JSON data from outside the sketch
    const savedHistory = localStorage.getItem('moodHistory');
    if (savedHistory) {
        // Parse JSON string back into JavaScript object
        moodHistory = JSON.parse(savedHistory);
    }
    
    // event listener for the "Set Mood" button
    document.getElementById('setMood').addEventListener('click', () => {
        // selected mood from dropdown
        currentMood = document.getElementById('moodSelect').value;
        
        // ===== LOCALSTORAGE: SAVE DATA =====
        // Save the current mood to localStorage
        // This demonstrates saving data outside the sketch
        localStorage.setItem('mood', currentMood);
        
        // ===== JSON: SAVE DATA =====
        // current mood to history with timestamp
        moodHistory.push({
            mood: currentMood,
            timestamp: new Date().toISOString()
        });
        // Convert JavaScript object to JSON string and save to localStorage
        localStorage.setItem('moodHistory', JSON.stringify(moodHistory));
    });
    
    // Initialize visualization elements
    // Happy mood: Create bouncing particles
    for (let i = 0; i < 50; i++) {
        particles.push(new Particle());
    }
    
    // Sad mood: Create wave objects
    for (let i = 0; i < 5; i++) {
        waves.push(new Wave(i * 100));
    }
    
    // Anxious mood: Create jittery lines
    for (let i = 0; i < 20; i++) {
        lines.push(new AnxiousLine());
    }
    
    // Excited mood: Create stars
    for (let i = 0; i < 100; i++) {
        stars.push(new Star());
    }
}

// P5.js draw function - runs continuously
function draw() {
    // Clear background
    background(240);
    
    //  different visualizations based on current mood
    switch(currentMood) {
        case 'happy':
            drawHappy();
            break;
        case 'sad':
            drawSad();
            break;
        case 'anxious':
            drawAnxious();
            break;
        case 'excited':
            drawExcited();
            break;
    }
}

// Class for happy mood particles
class Particle {
    constructor() {
        // Initialize particle properties
        this.pos = createVector(random(width), random(height));
        this.vel = createVector(random(-2, 2), random(-2, 2));
        this.size = random(10, 30);
        this.color = color(random(200, 255), random(200, 255), random(100, 200));
    }
    
    //  particle position
    update() {
        this.pos.add(this.vel);
        // Bounce off edges
        if (this.pos.x < 0 || this.pos.x > width) this.vel.x *= -1;
        if (this.pos.y < 0 || this.pos.y > height) this.vel.y *= -1;
    }
    
    //  particle
    display() {
        fill(this.color);
        noStroke();
        circle(this.pos.x, this.pos.y, this.size);
    }
}

// Class for sad mood waves
class Wave {
    constructor(offset) {
        this.offset = offset;
        this.amplitude = 50;
        this.period = 200;
        this.speed = 0.02;
    }
    
    //  wave
    display() {
        stroke(100, 150, 255);
        noFill();
        beginShape();
        for (let x = 0; x < width; x += 10) {
            let y = sin((x + this.offset) * this.speed) * this.amplitude + height/2;
            vertex(x, y);
        }
        endShape();
        this.offset += 1;
    }
}

// Class for anxious mood lines
class AnxiousLine {
    constructor() {
        this.x = random(width);
        this.y = random(height);
        this.length = random(50, 150);
        this.angle = random(TWO_PI);
        this.jitter = 0;
    }
    
    // Draw jittery line
    display() {
        this.jitter = random(-5, 5);
        stroke(150, 100, 100);
        line(
            this.x + this.jitter,
            this.y + this.jitter,
            this.x + cos(this.angle) * this.length + this.jitter,
            this.y + sin(this.angle) * this.length + this.jitter
        );
        this.angle += 0.02;
    }
}

// Class for excited mood stars
class Star {
    constructor() {
        this.pos = createVector(random(width), random(height));
        this.size = random(3, 8);
        this.speed = random(3, 8);
        this.angle = random(TWO_PI);
        this.color = color(255, random(200, 255), random(100, 200));
        this.trail = [];
        this.maxTrailLength = 5;
    }
    
    //  star position and trail
    update() {
        // current position to trail
        this.trail.push(createVector(this.pos.x, this.pos.y));
        if (this.trail.length > this.maxTrailLength) {
            this.trail.shift();
        }
        
        // position
        this.pos.x += cos(this.angle) * this.speed;
        this.pos.y += sin(this.angle) * this.speed;
        
        // Wrap around screen
        if (this.pos.x < 0) this.pos.x = width;
        if (this.pos.x > width) this.pos.x = 0;
        if (this.pos.y < 0) this.pos.y = height;
        if (this.pos.y > height) this.pos.y = 0;
        
        // Randomly change direction
        if (random(1) < 0.02) {
            this.angle += random(-PI/4, PI/4);
        }
    }
    
    // star and its trail
    display() {
        // trail
        for (let i = 0; i < this.trail.length - 1; i++) {
            let alpha = map(i, 0, this.trail.length - 1, 50, 255);
            stroke(255, 255, 0, alpha);
            strokeWeight(2);
            line(
                this.trail[i].x,
                this.trail[i].y,
                this.trail[i + 1].x,
                this.trail[i + 1].y
            );
        }
        
        // star
        fill(this.color);
        noStroke();
        circle(this.pos.x, this.pos.y, this.size);
        
        // Draw star points
        stroke(255, 255, 0);
        strokeWeight(1);
        for (let i = 0; i < 5; i++) {
            let angle = TWO_PI * i / 5 - PI/2;
            let x1 = this.pos.x + cos(angle) * this.size;
            let y1 = this.pos.y + sin(angle) * this.size;
            let x2 = this.pos.x + cos(angle + PI/5) * (this.size * 0.4);
            let y2 = this.pos.y + sin(angle + PI/5) * (this.size * 0.4);
            line(x1, y1, x2, y2);
        }
    }
}

// Function to draw happy mood visualization
function drawHappy() {
    particles.forEach(particle => {
        particle.update();
        particle.display();
    });
}

// Function to draw sad mood visualization
function drawSad() {
    waves.forEach(wave => wave.display());
}

// Function to draw anxious mood visualization
function drawAnxious() {
    lines.forEach(line => line.display());
}

// Function to draw excited mood visualization
function drawExcited() {
    //  some background stars occasionally
    if (frameCount % 30 === 0) {
        stars.push(new Star());
    }
    
    // Limit the number of stars
    if (stars.length > 150) {
        stars.shift();
    }
    
    stars.forEach(star => {
        star.update();
        star.display();
    });
}

// Handle window resizing
function windowResized() {
    resizeCanvas(windowWidth, windowHeight - 100);
} 