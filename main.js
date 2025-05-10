
document.addEventListener("DOMContentLoaded", function () {
	// Elements
	const carousel = document.getElementById("memory-carousel");
	const cards = document.querySelectorAll(".memory-card");
	const prevBtn = document.getElementById("prev-btn");
	const nextBtn = document.getElementById("next-btn");

	// Variables
	let currentIndex = 0;
	let startX, startY;
	let isDragging = false;
	let theta = 0;
	let radius = window.innerWidth <= 768 ? 250 : 400;
	const totalCards = cards.length;

	// Initialize
	function init() {
		// Position cards in a circle
		arrangeCards();

		// Add event listeners
		prevBtn.addEventListener("click", prevCard);
		nextBtn.addEventListener("click", nextCard);
		cards.forEach((card) => {
			card.addEventListener("click", flipCard);
		});

		// Touch/mouse events for dragging
		carousel.addEventListener("mousedown", dragStart);
		carousel.addEventListener("touchstart", dragStart, { passive: true });
		document.addEventListener("mousemove", drag);
		document.addEventListener("touchmove", drag, { passive: false });
		document.addEventListener("mouseup", dragEnd);
		document.addEventListener("touchend", dragEnd);

		// Keyboard navigation
		document.addEventListener("keydown", handleKeyDown);

		// Start ambient sound
		playAmbientSound();
	}

	// Arrange cards in a circle
	function arrangeCards() {
		const angle = 360 / totalCards;
		cards.forEach((card, index) => {
			const cardAngle = angle * index;
			const rad = (cardAngle * Math.PI) / 180;
			const x = radius * Math.sin(rad);
			const z = radius * Math.cos(rad) * -1;
			card.style.transform = `rotateY(${cardAngle}deg) translateZ(${radius}px)`;
			card.dataset.index = index;
		});
	}

	// Rotate carousel
	function rotateCarousel() {
		carousel.style.transform = `rotateY(${theta}deg)`;
		currentIndex = Math.round(Math.abs(theta / (360 / totalCards)) % totalCards);
		if (currentIndex >= totalCards) currentIndex = 0;
	}

	function nextCard() {
		theta -= 360 / totalCards;
		rotateCarousel();
	}

	function prevCard() {
		theta += 360 / totalCards;
		rotateCarousel();
	}

	function flipCard(e) {
		const card = e.currentTarget;
		card.classList.toggle("flipped");
	}

	function dragStart(e) {
		e.preventDefault();
		isDragging = true;
		startX = e.pageX || e.touches[0].pageX;
	}

	function drag(e) {
		if (!isDragging) return;
		e.preventDefault();
		const currentX = e.pageX || (e.touches ? e.touches[0].pageX : startX);
		const diffX = currentX - startX;
		const sensitivity = 0.5;
		const newTheta = theta + diffX * sensitivity;
		carousel.style.transform = `rotateY(${newTheta}deg)`;
	}

	function dragEnd(e) {
		if (!isDragging) return;
		isDragging = false;
		const currentX = e.pageX || (e.changedTouches ? e.changedTouches[0].pageX : startX);
		const diffX = currentX - startX;
		if (Math.abs(diffX) > 20) {
			if (diffX > 0) {
				prevCard();
			} else {
				nextCard();
			}
		} else {
			const anglePerCard = 360 / totalCards;
			const snapAngle = Math.round(theta / anglePerCard) * anglePerCard;
			theta = snapAngle;
			rotateCarousel();
		}
	}

	function handleKeyDown(e) {
		if (e.key === "ArrowLeft") {
			nextCard();
		} else if (e.key === "ArrowRight") {
			prevCard();
		} else if (e.key === "Enter" || e.key === " ") {
			const currentCard = document.querySelector(`.memory-card[data-index="${currentIndex}"]`);
			if (currentCard) {
				currentCard.classList.toggle("flipped");
			}
		}
	}

	function playAmbientSound() {
		// Optional ambient sound logic
	}

	window.addEventListener("resize", () => {
		radius = window.innerWidth <= 768 ? 250 : 400;
		arrangeCards();
		rotateCarousel();
	});

	init();
});
