<script module lang="ts">
  export interface cardType {
    period: number;
    price: number;
  }
</script>

<script lang="ts">
    import { onMount } from "svelte";
	  import { fade } from "svelte/transition";
    import { ArrowLeft, ChevronLeft, ChevronRight, ChevronUp } from "lucide-svelte";
    import { cn } from "$lib/utils.js";

    let descriptionBlockVisibleState = $state(false);
    let centralCardIndex = $state(0);
    let listScrollAnimationTime = 500;

    const cardsArr: cardType[] = [
      {
        period: 10,
        price: 800
      },
      {
        period: 30,
        price: 1200
      },{
        period: 60,
        price: 2300
      },{
        period: 90,
        price: 2300
      },{
        period: 180,
        price: 3200
      },{
        period: 365,
        price: 9900
      },
    ]
  
    onMount(() => {
      const scrollContainer = document.querySelector(".scroll-container") as HTMLElement;
      const cards = document.querySelectorAll(".scroll-item") as NodeListOf<HTMLElement>;

      const containerCenter = scrollContainer.clientWidth / 2;
        
      $effect (() => {
        if (descriptionBlockVisibleState) {
          setTimeout(() => {window.scrollBy({
              top: window.outerHeight/2,
              behavior: "smooth",
          });
        }, listScrollAnimationTime/2)
        }
      });

      function updateElements() {
        let minDistance = Infinity;

        cards.forEach((item, index) => {
          const rect = item.getBoundingClientRect();
          const itemCenter = rect.left + rect.width / 2;
          const distance = Math.abs(containerCenter - itemCenter);
          const scale = Math.max(0.75, 0.95 - distance / containerCenter / 5);

          item.style.transform = `scale(${scale})`;

          // Find the item closest to the center
          if (distance < minDistance) {
            minDistance = distance;
            centralCardIndex = index;
          }
        });
      }
  
      function scrollToItem(event: MouseEvent) {
        const selectedTarget = event.currentTarget as HTMLElement;
        const rect = selectedTarget.getBoundingClientRect();
        const itemCenter = rect.left + rect.width / 2;

        const scrollOffset = scrollContainer.scrollLeft + (itemCenter - containerCenter);
  
        scrollContainer.scrollTo({
          left: scrollOffset,
          behavior: "smooth"
        });
      }
  
      // Attach event listeners to each item
      cards.forEach((item) => item.addEventListener("click", scrollToItem));
      scrollContainer.addEventListener("scroll", updateElements);
      window.addEventListener("scroll", () => {
        if(window.scrollY == 0) descriptionBlockVisibleState = false;
      });

      // Initial call to place cards
      updateElements();
  
      return () => {
        cards.forEach((item) => item.removeEventListener("click", scrollToItem));
        scrollContainer.removeEventListener("scroll", updateElements);
        window.removeEventListener("scroll", () => {
        if(window.scrollY == 0) descriptionBlockVisibleState = false;
      });
      };
    });

    const previousPageRedirection = () => {
      console.log("redirecting to previous page");
    }
    const cardSubmit = (id: number) => {
      console.log(`${id} payment has succesfully initiated`)
    };
    const premiumSubmit = () => {
      console.log("redirecting to premium page")
    }
</script>

  <section class="pt-8 px-6 flex flex-row gap-6
  absolute top-0 justify-center">
      <button class="z-50"
              onclick={previousPageRedirection}>
        <ArrowLeft size={30} color="#000000" />
      </button>
      <div class="flex flex-col gap-2">
          <h1 class="text-2xl font-inter font-semibold">Подписка</h1>
      </div>
    </section>
    
  <section class="min-h-[100vh] relative flex flex-col pb-6">

      <div class="flex flex-col flex-grow items-center justify-between pt-[20vh]
      transition-all duration-100">
      
        <!-- Dots -->
        <div class="w-[25vw] max-w-36 flex flex-row justify-between pb-10">
          {#each cardsArr as _, index}
            <div class={cn(
              "h-2 w-2 transition-all duration-300 rounded-sm",
              centralCardIndex == index ? "bg-blue-500 scale-x-[2] scale-y-[2.5]" : "bg-slate-200 scale-x-[1] scale-y-[1]",
            )}></div>
          {/each}
        </div>
      
        <div
          class="scroll-container w-full overflow-x-auto flex snap-x snap-mandatory scrollbar-hide px-[50%] scroll-smooth"
        >
          <!-- The card -->
          {#each cardsArr as _, index}
            <div
              class={cn("scroll-item",
                centralCardIndex == index ? "opacity-[1]" : "opacity-[0.75]"
              )}
              style="background: linear-gradient(35deg,  #ffffff, #f7f7f7);"
            >
              <h1 class="text-sky-500  text-4xl font-inter font-semibold
              max-[380px]:text-3xl">{cardsArr[index].period}-дней</h1>
              
              <div class="relative w-full">
                <h1 class="text-slate-400 text-2xl font-inter font-bold
                max-[380px]:text-lg">
                  {cardsArr[index].price} руб.
                </h1>
                
                <ChevronLeft size={50} strokeWidth={1.5} color={centralCardIndex == index ? "#0ea5e9" : "#809CAD"}  
                  class={cn(
                    "absolute top-0 bottom-0 left-0",
                    index == 0 ? "invisible" : "visible")}
                  style="margin: auto 0; transform: translateX(-70%)"/>
                <ChevronRight size={50} strokeWidth={1.5} color={centralCardIndex == index ? "#0ea5e9" : "#809CAD"}  
                  class={cn(
                    "absolute top-0 bottom-0 right-0",
                    index == 0 ? "invisible" : "visible")}
                  style="margin: auto 0; transform: translateX(70%)"/>
              </div>
              <button
                class="shadow-[inset_-5px_5px_12.5px_0px_rgba(255,_255,_255,_0.25)]
                bg-gradient-to-r from-sky-500 to-blue-400 text-white text-base font-inter font-semibold px-4 py-4 rounded-md w-full
                max-[380px]:text-sm"
                onclick={() => cardSubmit(index)}
              >
                Перейти к оплате
              </button>
          </div>
          {/each}
        </div>

        <!-- About -->
        <button 
          class="text-sky-600 text-2xl font-inter z-50 transition-all duration-500 justify-between items-center flex flex-col" 
          
          onclick={() => {descriptionBlockVisibleState = !descriptionBlockVisibleState}}
        >
          {#if descriptionBlockVisibleState}
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
          style="height: {descriptionBlockVisibleState ? '100vh' : '0px'}"
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
            <button class="w-full h-auto flex flex-col rounded-xl bg-sky-500 gap-5 p-5"
                    style="filter: drop-shadow(0 4px 4px rgba(163, 215, 248, 0.5)); box-shadow: inset 0 4px 4px rgba(163, 215, 248, 0.5);"
                    onclick={premiumSubmit}>
                <h1 class="text-white text-xl font-inter font-bold text-center">Подключить премиум аккаунт</h1>
            </button>
          </div>
        </div>
      </div>

    <div class="w-full flex text-slate-400  text-sm font-inter p-4 absolute bottom-0">
      <h1>Оплачивая услугу, <br>
        вы соглашаетесь с <u><a href="/">офертой</a></u></h1>
    </div>
  </section>