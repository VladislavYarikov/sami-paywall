<script lang="ts">
    import { onMount } from "svelte";
    import { ArrowLeft, ChevronUp } from "lucide-svelte";
	  import { fade } from "svelte/transition";

    let open = $state(false);
    let listScrollAnimationTime = 500;

    let daysArr = [10, 30, 60, 90, 180, 360];
    let priceArr = [800, 1200, 2300, 3200, 5900, 9900];
  
    onMount(() => {
      const container = document.querySelector(".scroll-container") as HTMLElement;
      const items = document.querySelectorAll(".scroll-item") as NodeListOf<HTMLElement>;
      const dots = document.querySelectorAll(".scroll-dot") as NodeListOf<HTMLElement>;
        
        $effect (() => {
          if (open) {
            setTimeout(() => {window.scrollBy({
                top: window.outerHeight/2,
                behavior: "smooth",
            });
            console.log()
          }, listScrollAnimationTime/2)
          }
        });

        window.addEventListener("scroll", () => {
          if(window.scrollY == 0) open = false;
        });

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
                dot.style.transform = "scale(2, 2.5)"; // 200% size
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

  <section class="pt-8 px-6 flex flex-row gap-6
  absolute top-0 justify-center">
      <ArrowLeft size={30} color="#000000" />
      <div class="flex flex-col gap-2">
          <h1 class="text-2xl font-inter font-semibold">Подписка</h1>
      </div>
    </section>
    
  <section class="min-h-[100vh] relative flex flex-col pb-6">

      <div class="flex flex-col flex-grow items-center justify-between pt-[20vh]
      transition-all duration-100">
        <!-- Dots -->
        <div class="w-[25vw] max-w-36 flex flex-row justify-between pb-10">
          {#each Array(6) as _, index}
            <div class="scroll-dot h-2 w-2 bg-slate-200 transition-all duration-300 rounded-sm"></div>
          {/each}
        </div>
      
        <div
          class="scroll-container w-full overflow-x-auto flex snap-x snap-mandatory scrollbar-hide px-[50%] scroll-smooth"
        >
          <!-- The card -->
          {#each Array(6) as _, index}
            <div
              class="relative shadow-[rgba(163,_215,_248,_0.5)_5px_0px_6.4px_0px] 
              overflow-hidden
              transition-opacity duration-100 scroll-item snap-center 
              border-2 text-white text-center w-[65vw] max-w-96 p-8 pt-5 
              flex-col rounded-xl flex-shrink-0 h-[380px] flex items-center justify-between cursor-pointer
              max-[380px]:h-[280px]
              "
              style="background: linear-gradient(35deg,  #ffffff, #f7f7f7);"
            >
              
              <h1 class="text-sky-500  text-4xl font-inter font-semibold
              max-[380px]:text-3xl">{daysArr[index]}-дней</h1>
              <h1 class="text-slate-400 text-2xl font-inter font-bold
              max-[380px]:text-lg">
                {priceArr[index]} руб.
              </h1>
              <button
                class="shadow-[inset_-5px_5px_12.5px_0px_rgba(255,_255,_255,_0.25)]
                bg-gradient-to-r from-sky-500 to-blue-400 text-white text-base font-inter font-semibold px-4 py-4 rounded-md w-full
                max-[380px]:text-sm"
              >
                Перейти к оплате
              </button>
          </div>
          {/each}
        </div>

        <!-- About -->
        <button 
          class="text-sky-600 text-2xl font-inter z-50 transition-all duration-500 justify-between items-center flex flex-col" 
          on:click={() => open = !open}
        >
          {#if open}
            <span in:fade={{ duration: 1000 }} out:fade={{ duration: 100 } } class="h-0 py-20 flex items-center">
              <ChevronUp size={80} color="#2177AD" />
            </span>
          {:else}
            <span in:fade={{ duration: 1000 }} out:fade={{ duration: 100 }} class="h-0 py-20 flex items-center">
              Подробнее...
            </span>
          {/if}
        </button>

        <div 
          class="list w-full block overflow-hidden transition-all duration-{listScrollAnimationTime} ease-in-out
          "
          style="height: {open ? '100vh' : '0px'}"
        >
          <div class="pt-0 pb-20 px-7 flex flex-col
          justify-between h-full">
            {#each Array(2) as _, index}
              <div class="w-full h-auto flex flex-col rounded-xl bg-white gap-5 p-8
              max-[380px]:p-5"
              style="filter: drop-shadow(0 4px 4px rgba(163, 215, 248, 0.5)); box-shadow: inset 0 4px 4px rgba(163, 215, 248, 0.5);">
                <h1 class="text-sky-600 text-2xl font-inter font-bold text-center
                max-[380px]:text-xl">Заголовок {index}</h1>
                <h1 class="font-inter text-left text-base
                max-[380px]:text-sm">Какая-то информация. Инфа фафваКакая-то информация. Какая-то информация. Какая-то информация. Какая-то информация.</h1>
              </div>
            {/each}
            <div class="w-full h-auto flex flex-col rounded-xl bg-sky-500 gap-5 p-5"
              style="filter: drop-shadow(0 4px 4px rgba(163, 215, 248, 0.5)); box-shadow: inset 0 4px 4px rgba(163, 215, 248, 0.5);">
                <h1 class="text-white text-xl font-inter font-bold text-center">Подключить премиум аккаунт</h1>
               </div>
          </div>
        </div>
      </div>

    <div class="w-full flex text-slate-400  text-sm font-inter p-4 absolute bottom-0">
      <h1>Оплачиваю услугу, <br>
        вы соглашаетесь с <u><a href="">офертой</a></u></h1>
    </div>
  </section>