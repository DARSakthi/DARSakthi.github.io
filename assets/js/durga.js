(() => {
// Canvas setup
        const canvas = document.getElementById('simulationCanvas');
        const ctx = canvas.getContext('2d');

        // Resize canvas
        function resizeCanvas() {
            const container = canvas.parentElement;
            canvas.width = container.clientWidth;
            canvas.height = container.clientHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Simulation parameters
        const params = {
            spawnRate: 5,
            attractorStrength: 1.0,
            friction: 0.92,
            noise: 0.1,
            showField: true,
            showTrajectories: true,
            autoSpawn: false
        };

        // Attractor basins (6 primitives)
        const basins = [
            { name: 'Assertion', x: 0.17, y: 0.25, strength: 2.5, radius: 0.08, color: '#E07A5F', count: 0 },
            { name: 'Context', x: 0.5, y: 0.25, strength: 2.0, radius: 0.08, color: '#8D99AE', count: 0 },
            { name: 'Evidence', x: 0.83, y: 0.25, strength: 2.2, radius: 0.08, color: '#4A5C6A', count: 0 },
            { name: 'Contrast', x: 0.17, y: 0.65, strength: 1.8, radius: 0.08, color: '#E07A5F', count: 0 },
            { name: 'Gap', x: 0.5, y: 0.65, strength: 1.5, radius: 0.08, color: '#8D99AE', count: 0 },
            { name: 'Entity', x: 0.83, y: 0.65, strength: 2.0, radius: 0.08, color: '#4A5C6A', count: 0 }
        ];

        // Particle types (properties that attract to different basins)
        const particleTypes = [
            { properties: ['has_polarity', 'has_strength'], preferred: ['Assertion', 'Gap'] },
            { properties: ['metrics', 'statistical_measures'], preferred: ['Evidence', 'Assertion'] },
            { properties: ['context_type', 'property_bag'], preferred: ['Context', 'Gap'] },
            { properties: ['comparison_type', 'groups'], preferred: ['Contrast', 'Assertion'] },
            { properties: ['gap_type', 'evidence_absence'], preferred: ['Gap', 'Context'] },
            { properties: ['entity_type', 'canonical_name'], preferred: ['Entity', 'Assertion'] }
        ];

        // Particles array
        let particles = [];
        let isRunning = true;
        let feedbackLoops = 0;
        let autoSpawnInterval = null;

        // Particle class
        class Particle {
            constructor() {
                this.x = 0.5 + (Math.random() - 0.5) * 0.3;
                this.y = 0.95;
                this.vx = (Math.random() - 0.5) * 0.01;
                this.vy = -0.02 - Math.random() * 0.01;
                this.crystallized = false;
                this.basin = null;
                this.history = [{x: this.x, y: this.y}];
                this.age = 0;

                // Assign random properties
                const type = particleTypes[Math.floor(Math.random() * particleTypes.length)];
                this.properties = type.properties;
                this.preferredBasins = type.preferred;
                this.color = '#EDF2F4';
            }

            computeAttractorForces() {
                let fx = 0, fy = 0;

                for (const basin of basins) {
                    const dx = basin.x - this.x;
                    const dy = basin.y - this.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    // Property affinity
                    let affinity = 1.0;
                    if (this.preferredBasins.includes(basin.name)) {
                        affinity = 2.5;
                    }

                    // Attractor force
                    const force = basin.strength * params.attractorStrength * affinity / (0.1 + dist * dist);

                    if (dist > 0.001) {
                        fx += (dx / dist) * force * 0.001;
                        fy += (dy / dist) * force * 0.001;
                    }
                }

                return { fx, fy };
            }

            update() {
                if (this.crystallized) return;

                this.age++;

                // Compute attractor forces
                const forces = this.computeAttractorForces();

                // Add noise
                const noiseX = (Math.random() - 0.5) * params.noise * 0.01;
                const noiseY = (Math.random() - 0.5) * params.noise * 0.01;

                // Update velocity
                this.vx += forces.fx + noiseX;
                this.vy += forces.fy + noiseY;

                // Apply friction
                this.vx *= params.friction;
                this.vy *= params.friction;

                // Update position
                this.x += this.vx;
                this.y += this.vy;

                // Record history
                if (this.age % 3 === 0) {
                    this.history.push({x: this.x, y: this.y});
                }

                // Check for crystallization
                for (const basin of basins) {
                    const dx = basin.x - this.x;
                    const dy = basin.y - this.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < basin.radius) {
                        this.crystallized = true;
                        this.basin = basin;
                        this.color = basin.color;
                        basin.count++;
                        feedbackLoops++;
                        break;
                    }
                }

                // Remove if out of bounds
                if (this.x < -0.1 || this.x > 1.1 || this.y < -0.1) {
                    this.crystallized = true; // Mark for removal
                }
            }

            draw(ctx, width, height) {
                const px = this.x * width;
                const py = this.y * height;

                // Draw trajectory
                if (params.showTrajectories && this.history.length > 1) {
                    ctx.beginPath();
                    ctx.strokeStyle = this.crystallized ? this.color : 'rgba(237, 242, 244, 0.2)';
                    ctx.lineWidth = 1;
                    for (let i = 0; i < this.history.length - 1; i++) {
                        const alpha = (i / this.history.length) * 0.5;
                        ctx.globalAlpha = alpha;
                        ctx.moveTo(this.history[i].x * width, this.history[i].y * height);
                        ctx.lineTo(this.history[i+1].x * width, this.history[i+1].y * height);
                    }
                    ctx.stroke();
                    ctx.globalAlpha = 1;
                }

                // Draw particle
                ctx.beginPath();
                if (this.crystallized && this.basin) {
                    // Crystallized - draw star
                    const spikes = 5;
                    const outerRadius = 8;
                    const innerRadius = 4;

                    for (let i = 0; i < spikes * 2; i++) {
                        const radius = i % 2 === 0 ? outerRadius : innerRadius;
                        const angle = (i * Math.PI) / spikes - Math.PI / 2;
                        const x = px + Math.cos(angle) * radius;
                        const y = py + Math.sin(angle) * radius;
                        if (i === 0) ctx.moveTo(x, y);
                        else ctx.lineTo(x, y);
                    }
                    ctx.closePath();
                    ctx.fillStyle = this.color;
                    ctx.fill();
                    ctx.strokeStyle = 'white';
                    ctx.lineWidth = 2;
                    ctx.stroke();
                } else {
                    // Uncrystallized - draw circle
                    ctx.arc(px, py, 5, 0, Math.PI * 2);
                    ctx.fillStyle = this.color;
                    ctx.fill();
                    ctx.strokeStyle = '#E07A5F';
                    ctx.lineWidth = 2;
                    ctx.stroke();
                }
            }
        }

        // Draw potential field
        function drawPotentialField() {
            if (!params.showField) return;

            const w = canvas.width;
            const h = canvas.height;
            const resolution = 20;

            for (let x = 0; x < w; x += resolution) {
                for (let y = 0; y < h; y += resolution) {
                    const nx = x / w;
                    const ny = y / h;

                    // Compute potential at this point
                    let potential = 0;
                    for (const basin of basins) {
                        const dx = nx - basin.x;
                        const dy = ny - basin.y;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        potential -= basin.strength * params.attractorStrength * Math.exp(-dist * dist / (2 * basin.radius * basin.radius));
                    }

                    // Map potential to color
                    const normalized = Math.max(0, Math.min(1, (potential + 3) / 3));
                    const r = Math.floor(224 * (1 - normalized) + 26 * normalized);
                    const g = Math.floor(122 * (1 - normalized) + 29 * normalized);
                    const b = Math.floor(95 * (1 - normalized) + 33 * normalized);

                    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.15)`;
                    ctx.fillRect(x, y, resolution, resolution);
                }
            }
        }

        // Draw basins
        function drawBasins() {
            const w = canvas.width;
            const h = canvas.height;

            for (const basin of basins) {
                const bx = basin.x * w;
                const by = basin.y * h;
                const br = basin.radius * Math.min(w, h);

                // Draw attraction field circles
                for (let r = br * 2; r <= br * 5; r += br) {
                    ctx.beginPath();
                    ctx.arc(bx, by, r, 0, Math.PI * 2);
                    ctx.strokeStyle = basin.color;
                    ctx.lineWidth = 1;
                    ctx.globalAlpha = 0.15;
                    ctx.stroke();
                }
                ctx.globalAlpha = 1;

                // Draw basin with gradient
                const gradient = ctx.createRadialGradient(bx, by, 0, bx, by, br);
                gradient.addColorStop(0, basin.color);
                gradient.addColorStop(1, basin.color + '40');

                ctx.beginPath();
                ctx.arc(bx, by, br, 0, Math.PI * 2);
                ctx.fillStyle = gradient;
                ctx.fill();

                // Draw basin border
                ctx.beginPath();
                ctx.arc(bx, by, br, 0, Math.PI * 2);
                ctx.strokeStyle = 'white';
                ctx.lineWidth = 3;
                ctx.stroke();

                // Draw label
                ctx.fillStyle = 'white';
                ctx.font = 'bold 14px Segoe UI';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(basin.name, bx, by);
            }
        }

        // Draw source region
        function drawSource() {
            const w = canvas.width;
            const h = canvas.height;

            ctx.fillStyle = 'rgba(74, 92, 106, 0.4)';
            ctx.strokeStyle = '#E07A5F';
            ctx.lineWidth = 2;

            const sx = w * 0.3;
            const sy = h * 0.88;
            const sw = w * 0.4;
            const sh = h * 0.1;

            ctx.beginPath();
            ctx.roundRect(sx, sy, sw, sh, 10);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = '#EDF2F4';
            ctx.font = 'bold 12px Segoe UI';
            ctx.textAlign = 'center';
            ctx.fillText('RAW EXTRACTION', sx + sw/2, sy + sh/2 - 8);
            ctx.font = '11px Segoe UI';
            ctx.fillStyle = '#8D99AE';
            ctx.fillText('(Undifferentiated Stem Cells)', sx + sw/2, sy + sh/2 + 10);
        }

        // Animation loop
        function animate() {
            if (!isRunning) return;

            // Clear canvas
            ctx.fillStyle = '#0D0F11';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw potential field
            drawPotentialField();

            // Draw basins
            drawBasins();

            // Draw source
            drawSource();

            // Update and draw particles
            particles = particles.filter(p => {
                if (p.x < -0.1 || p.x > 1.1 || p.y < -0.1) return false;
                return true;
            });

            for (const p of particles) {
                p.update();
                p.draw(ctx, canvas.width, canvas.height);
            }

            // Update stats
            updateStats();

            requestAnimationFrame(animate);
        }

        // Update statistics display
        function updateStats() {
            const total = particles.length;
            const crystallized = particles.filter(p => p.crystallized && p.basin).length;
            const inFlight = total - crystallized;

            document.getElementById('totalParticles').textContent = total;
            document.getElementById('crystallized').textContent = crystallized;
            document.getElementById('inFlight').textContent = inFlight;
            document.getElementById('feedbackLoops').textContent = feedbackLoops;

            // Update basin counts
            document.getElementById('assertionCount').textContent = basins[0].count;
            document.getElementById('contextCount').textContent = basins[1].count;
            document.getElementById('evidenceCount').textContent = basins[2].count;
            document.getElementById('contrastCount').textContent = basins[3].count;
            document.getElementById('gapCount').textContent = basins[4].count;
            document.getElementById('entityCount').textContent = basins[5].count;
        }

        // Control functions
        function spawnBatch() {
            for (let i = 0; i < params.spawnRate; i++) {
                setTimeout(() => {
                    particles.push(new Particle());
                }, i * 100);
            }
        }

        function toggleSimulation() {
            isRunning = !isRunning;
            document.getElementById('toggleBtn').textContent = isRunning ? 'Pause' : 'Resume';
            if (isRunning) animate();
        }

        function clearParticles() {
            particles = [];
            feedbackLoops = 0;
            for (const basin of basins) {
                basin.count = 0;
            }
        }

        function resetSimulation() {
            clearParticles();
            params.spawnRate = 5;
            params.attractorStrength = 1.0;
            params.friction = 0.92;
            params.noise = 0.1;

            document.getElementById('spawnRate').value = 5;
            document.getElementById('attractorStrength').value = 1.0;
            document.getElementById('friction').value = 0.92;
            document.getElementById('noise').value = 0.1;

            updateParam('spawnRate', 5);
            updateParam('attractorStrength', 1.0);
            updateParam('friction', 0.92);
            updateParam('noise', 0.1);
        }

        function updateParam(name, value) {
            params[name] = parseFloat(value);
            document.getElementById(name + 'Val').textContent = value;
        }

        function toggleField() {
            params.showField = document.getElementById('showField').checked;
        }

        function toggleTrajectories() {
            params.showTrajectories = document.getElementById('showTrajectories').checked;
        }

        function toggleAutoSpawn() {
            params.autoSpawn = document.getElementById('autoSpawn').checked;

            if (params.autoSpawn) {
                autoSpawnInterval = setInterval(() => {
                    if (isRunning) {
                        particles.push(new Particle());
                    }
                }, 500);
            } else {
                clearInterval(autoSpawnInterval);
            }
        }

        // Start animation
        animate();

        // Initial spawn
        setTimeout(spawnBatch, 500);

  window.spawnBatch = spawnBatch;
  window.toggleSimulation = toggleSimulation;
  window.clearParticles = clearParticles;
  window.resetSimulation = resetSimulation;
  window.updateParam = updateParam;
  window.toggleField = toggleField;
  window.toggleTrajectories = toggleTrajectories;
  window.toggleAutoSpawn = toggleAutoSpawn;
})();
