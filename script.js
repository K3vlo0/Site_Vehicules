// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  const cards = document.querySelectorAll(".vehicle-card");
  const categoryBtns = document.querySelectorAll(".category-btn");
  let current = 0;
  let currentCategory = 'all';
  let filteredCards = [...cards];

  // 3D Viewer variables
  let scene, camera, renderer, currentModel;
  let isMouseDown = false;
  let mouseX = 0, mouseY = 0;

  // Filter cards by category
  function filterCardsByCategory(category) {
    currentCategory = category;
    
    if (category === 'all') {
      filteredCards = [...cards];
    } else {
      filteredCards = [...cards].filter(card => 
        card.getAttribute('data-category') === category
      );
    }
    
    // Reset current to 0 when changing category
    current = 0;
    updateCarousel();
  }

  // Update carousel display
  function updateCarousel() {
    // Hide all cards first
    cards.forEach(card => {
      card.classList.remove("active", "prev", "next", "far-prev", "far-next");
    });
    
    // Only work with filtered cards
    if (filteredCards.length === 0) return;
    
    filteredCards.forEach((card, index) => {
      const position = index - current;
      
      if (position === 0) {
        card.classList.add("active");
      } else if (position === 1) {
        card.classList.add("next");
      } else if (position === -1) {
        card.classList.add("prev");
      } else if (position === 2) {
        card.classList.add("far-next");
      } else if (position === -2) {
        card.classList.add("far-prev");
      }
    });
  }

  // Initialize 3D Scene
  function init3DScene() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a1a);

    camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.set(5, 3, 5);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(800, 600);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const spotLight = new THREE.SpotLight(0xffa500, 0.5);
    spotLight.position.set(-10, 10, 10);
    scene.add(spotLight);
  }

  // Create 3D vehicle model (simplified)
  function createVehicleModel(vehicleType) {
    const group = new THREE.Group();

    // Basic car body
    const bodyGeometry = new THREE.BoxGeometry(4, 1.5, 2);
    const bodyMaterial = new THREE.MeshPhongMaterial({ 
      color: vehicleType === 'moto' ? 0x333333 : 0x8B4513,
      shininess: 30 
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 1;
    body.castShadow = true;
    group.add(body);

    // Wheels
    const wheelGeometry = new THREE.CylinderGeometry(0.6, 0.6, 0.3, 8);
    const wheelMaterial = new THREE.MeshPhongMaterial({ color: 0x222222 });
    
    if (vehicleType === 'moto') {
      // 2 wheels for motorcycle
      const frontWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
      frontWheel.position.set(1.5, 0.6, 0);
      frontWheel.rotation.z = Math.PI / 2;
      group.add(frontWheel);

      const backWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
      backWheel.position.set(-1.5, 0.6, 0);
      backWheel.rotation.z = Math.PI / 2;
      group.add(backWheel);
    } else {
      // 4 wheels for cars/trucks
      const positions = [
        { x: 1.5, z: 1.2 },
        { x: 1.5, z: -1.2 },
        { x: -1.5, z: 1.2 },
        { x: -1.5, z: -1.2 }
      ];

      positions.forEach(pos => {
        const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheel.position.set(pos.x, 0.6, pos.z);
        wheel.rotation.z = Math.PI / 2;
        wheel.castShadow = true;
        group.add(wheel);
      });
    }

    // Cabin/Windshield
    const cabinGeometry = new THREE.BoxGeometry(2.5, 1, 1.8);
    const cabinMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x87CEEB, 
      opacity: 0.7, 
      transparent: true 
    });
    const cabin = new THREE.Mesh(cabinGeometry, cabinMaterial);
    cabin.position.set(0.5, 2, 0);
    group.add(cabin);

    // Special features based on vehicle type
    if (vehicleType === 'camion') {
      // Add truck bed
      const bedGeometry = new THREE.BoxGeometry(2, 0.8, 1.8);
      const bedMaterial = new THREE.MeshPhongMaterial({ color: 0x654321 });
      const bed = new THREE.Mesh(bedGeometry, bedMaterial);
      bed.position.set(-1.5, 1.4, 0);
      group.add(bed);
    }

    return group;
  }

  // Open 3D Viewer
  function open3DViewer(vehicleName, vehicleType) {
    const modal = document.getElementById('viewer3d-modal');
    const container = document.getElementById('threejs-container');
    const modalTitle = document.getElementById('modal-vehicle-name');
    
    modalTitle.textContent = vehicleName + " - Vue 3D";
    modal.style.display = 'block';

    // Clear previous content
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    // Initialize 3D scene
    init3DScene();
    
    // Resize renderer to fit container
    const rect = container.getBoundingClientRect();
    renderer.setSize(rect.width, rect.height);
    camera.aspect = rect.width / rect.height;
    camera.updateProjectionMatrix();

    container.appendChild(renderer.domElement);

    // Create and add vehicle model
    currentModel = createVehicleModel(vehicleType);
    scene.add(currentModel);

    // Ground plane
    const groundGeometry = new THREE.PlaneGeometry(20, 20);
    const groundMaterial = new THREE.MeshPhongMaterial({ color: 0x2F4F2F });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Animation loop
    function animate() {
      if (modal.style.display === 'none') return;
      
      requestAnimationFrame(animate);
      
      // Auto-rotate if not interacting
      if (!isMouseDown) {
        currentModel.rotation.y += 0.005;
      }
      
      renderer.render(scene, camera);
    }
    animate();

    // Mouse controls
    const canvas = renderer.domElement;
    
    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('wheel', onWheel);

    function onMouseDown(event) {
      isMouseDown = true;
      mouseX = event.clientX;
      mouseY = event.clientY;
    }

    function onMouseMove(event) {
      if (!isMouseDown) return;

      const deltaX = event.clientX - mouseX;
      const deltaY = event.clientY - mouseY;

      currentModel.rotation.y += deltaX * 0.01;
      currentModel.rotation.x += deltaY * 0.01;

      mouseX = event.clientX;
      mouseY = event.clientY;
    }

    function onMouseUp() {
      isMouseDown = false;
    }

    function onWheel(event) {
      event.preventDefault();
      const scale = event.deltaY > 0 ? 1.1 : 0.9;
      camera.position.multiplyScalar(scale);
      camera.lookAt(scene.position);
    }
  }

  // Close 3D Viewer
  function close3DViewer() {
    const modal = document.getElementById('viewer3d-modal');
    modal.style.display = 'none';
    
    // Clean up Three.js resources
    if (renderer) {
      renderer.dispose();
      renderer = null;
    }
    if (scene) {
      scene.clear();
      scene = null;
    }
  }

  // Category navigation
  categoryBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      // Update active category button
      categoryBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      
      // Filter cards
      const category = btn.getAttribute('data-category');
      filterCardsByCategory(category);
    });
  });

  // 3D Viewer button listeners
  document.querySelectorAll('.view-3d-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = btn.closest('.vehicle-card');
      const vehicleName = card.querySelector('h2').textContent;
      const vehicleData = card.getAttribute('data-vehicle');
      
      // Determine vehicle type for 3D model
      let vehicleType = 'car'; // default
      if (vehicleData && vehicleData.includes('moto') || vehicleData && vehicleData.includes('babayaga')) {
        vehicleType = 'moto';
      } else if (vehicleData && vehicleData.includes('barrage') || vehicleData && vehicleData.includes('camion')) {
        vehicleType = 'camion';
      }
      
      open3DViewer(vehicleName, vehicleType);
    });
  });

  // Close modal listeners
  const closeBtn = document.querySelector('.close-3d');
  if (closeBtn) {
    closeBtn.addEventListener('click', close3DViewer);
  }
  
  const modal = document.getElementById('viewer3d-modal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target.id === 'viewer3d-modal') {
        close3DViewer();
      }
    });
  }

  // Escape key to close modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      close3DViewer();
    }
  });

  // Carousel navigation - Next button
  const nextBtn = document.getElementById("next");
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      if (filteredCards.length > 0) {
        current = (current + 1) % filteredCards.length;
        updateCarousel();
      }
    });
  }

  // Carousel navigation - Previous button
  const prevBtn = document.getElementById("prev");
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      if (filteredCards.length > 0) {
        current = (current - 1 + filteredCards.length) % filteredCards.length;
        updateCarousel();
      }
    });
  }

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (filteredCards.length === 0) return;
    
    if (e.key === "ArrowRight") {
      current = (current + 1) % filteredCards.length;
      updateCarousel();
    } else if (e.key === "ArrowLeft") {
      current = (current - 1 + filteredCards.length) % filteredCards.length;
      updateCarousel();
    }
  });

  // Click on card to select
  cards.forEach((card, index) => {
    card.addEventListener("click", (e) => {
      // Don't trigger if clicking on 3D button
      if (e.target.classList.contains('view-3d-btn')) return;
      
      // Find index in filtered cards
      const filteredIndex = filteredCards.indexOf(card);
      if (filteredIndex !== -1) {
        current = filteredIndex;
        updateCarousel();
      }
    });
  });

  // Initialize carousel
  updateCarousel();
});
