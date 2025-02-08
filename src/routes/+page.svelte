<script lang="ts">
    import { onMount } from "svelte";
    import { ArrowLeft } from "lucide-svelte";
  
    onMount(() => {
        const container = document.querySelector(".scroll-container") as HTMLElement;
        const items = document.querySelectorAll(".scroll-item") as NodeListOf<HTMLElement>;
        const dots = document.querySelectorAll(".scroll-dot") as NodeListOf<HTMLElement>;
  
            function updateSizes() {
  const containerCenter = container.clientWidth / 2;
  let closestItemIndex = 0;
  let minDistance = Infinity;

  items.forEach((item, index) => {
    const rect = item.getBoundingClientRect();
    const itemCenter = rect.left + rect.width / 2;
    const distance = Math.abs(containerCenter - itemCenter);
    const scale = Math.max(0.85, 0.95 - distance / containerCenter / 5);

    item.style.transform = `scale(${scale})`;

    // Find the item closest to the center
    if (distance < minDistance) {
      minDistance = distance;
      closestItemIndex = index;
    }
  });

  // Apply opacity and shadow updates
  items.forEach((item, index) => {
    if (index === closestItemIndex) {
      item.style.opacity = "1"; // Fully visible
      } else {
      item.style.opacity = "0.7"; // Dimmed effect
      }
  });

  // Update dot styles
  dots.forEach((dot, index) => {
    if (index === closestItemIndex) {
      dot.style.transform = "scale(2.5)"; // 200% size
      dot.style.backgroundColor = "#1A97E4"; // Blue color
    } else {
      dot.style.transform = "scale(1)"; // Normal size
      dot.style.backgroundColor = "#D9D9D9"; // Default gray color
    }
  });
}


  
      function scrollToItem(event: MouseEvent) {
        const target = event.currentTarget as HTMLElement;
        const containerCenter = container.clientWidth / 2;
        const rect = target.getBoundingClientRect();
        const itemCenter = rect.left + rect.width / 2;
        const scrollOffset = container.scrollLeft + (itemCenter - containerCenter);
  
        container.scrollTo({
          left: scrollOffset,
          behavior: "smooth"
        });
      }
  
      // Attach event listeners to each item
      items.forEach((item) => item.addEventListener("click", scrollToItem));
      container.addEventListener("scroll", updateSizes);
      updateSizes();
  
      return () => {
        items.forEach((item) => item.removeEventListener("click", scrollToItem));
        container.removeEventListener("scroll", updateSizes);
      };
    });
  </script>
  
  <section class="pt-8 px-6 flex flex-row gap-6">
    <ArrowLeft size={40} color="#000000" />
    <div class="flex flex-col gap-2">
        <h1 class="text-4xl font-inter font-semibold">Подписка</h1>
        <h1 class="text-gray-400 text-lg font-inter">Какая-то информация о подписке.</h1>
    </div>
  </section>

  <section class="absolute w-[100vw] top-[30%]
  flex flex-col items-center justify-center gap-10">
    <div
      class="scroll-container w-full overflow-x-auto flex snap-x snap-mandatory scrollbar-hide px-[50%] scroll-smooth"
    >
      {#each Array(5) as _, index}
        <div
            class="shadow-[rgba(163,_215,_248,_0.5)_5px_0px_6.4px_0px] 
            transition-opacity  duration-100 scroll-item snap-center 
            bg-red-500 text-white text-center w-[65vw] max-w-96 p-8 
            flex-col rounded-xl flex-shrink-0 h-[380px] flex items-center justify-between cursor-pointer"
            style="background: linear-gradient(35deg,  #ffffff, #f7f7f7);"
          >
          <h1 class="text-[#1A97E4] text-xl font-inter font-semibold ">Популярный {index + 1}</h1>
          <div>
            <h1 class="text-[#1A97E4] text-4xl font-inter font-semibold ">30-дней</h1>
          <h1 class="text-[#7D7D7D] text-sm font-inter font-medium ">Какая-то информация</h1>
          </div>
          <button class="shadow-[inset_-5px_5px_12.5px_0px_rgba(255,_255,_255,_0.25)]
          bg-gradient-to-r from-sky-500 to-blue-400 text-white text-base font-inter font-semibold px-4 py-4 rounded-md w-full">1200 руб</button>
        </div>
      {/each}
    </div>
    <div class="w-[65vw] max-w-96 flex flex-row justify-between">
        {#each Array(5) as _, index}
          <div class="scroll-dot h-2 w-2 bg-slate-200 transition-all duration-300 rounded-full"></div>
        {/each}
      </div>
  </section>
  