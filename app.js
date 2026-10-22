const container = document.querySelector("#banners");

function renderBanner(product) {
	return `
    <div class="banner" id="banner-${product.id}" style="--brand: ${product.color}">
      <div class="bg"></div>
      <h2 class="headline">${product.name}</h2>
      <p class="fact">${product.facts[0]}</p>
      <p class="price">$${product.price.toFixed(2)}</p>
      <a class="cta" href="#">${product.cta}</a>
    </div>
  `;
}

container.innerHTML = products.map(renderBanner).join("");

function animateBanner(banner, index) {
	const q = gsap.utils.selector(banner);

	const tl = gsap.timeline({
		defaults: { duration: 0.6, ease: "power2.out" },
		delay: index * 0.3,
	});

	tl.from(q(".bg"), { scale: 1.2, autoAlpha: 0 })
		.from(q(".headline"), { y: 30, autoAlpha: 0 }, "-=0.3")
		.from(q(".fact"), { y: 20, autoAlpha: 0 }, "-=0.4")
		.from(q(".price"), { x: -20, autoAlpha: 0 }, "<")
		.addLabel("cta")
		.from(q(".cta"), { scale: 0, autoAlpha: 0, ease: "back.out(1.7)" }, "cta+=0.1");

	return tl;
}

document.querySelectorAll(".banner").forEach((banner, index) => {
	const tl = animateBanner(banner, index);
	banner.addEventListener("mouseenter", () => tl.restart());
});
