<script setup lang="ts">
const links = [
    {
        title: 'Boutique',
        items: [
            { label: 'Nouveautés', to: '/products/new' },
            { label: 'Meilleures ventes', to: '/products/best-sellers' },
            { label: 'Promotions', to: '/products/sale' },
            { label: 'Cartes cadeaux', to: '/gift-cards' }
        ]
    },
    {
        title: 'Aide & Info',
        items: [
            { label: 'Suivre ma commande', to: '/track-order' },
            { label: 'Livraisons & Retours', to: '/shipping' },
            { label: 'FAQ', to: '/faq' },
            { label: 'Contact', to: '/contact' }
        ]
    },
    {
        title: 'Légal',
        items: [
            { label: 'Mentions légales', to: '/legal/mentions' },
            { label: 'Politique de confidentialité', to: '/legal/privacy' },
            { label: 'CGV', to: '/legal/terms' },
            { label: 'Cookies', to: '/legal/cookies' }
        ]
    }
]

const email = ref('')

const subscribe = () => {
    // TODO: Implement newsletter subscription
    console.log('Subscribe:', email.value)
    email.value = ''
}
</script>

<template>
    <section class="relative py-32 bg-black text-white overflow-hidden">
        <div class="container mx-auto px-6 relative z-10 flex flex-col lg:flex-row gap-16 lg:gap-32">
            <!-- Newsletter -->
            <div class="w-full lg:w-1/2">
            <h3 class="text-6xl md:text-8xl font-syne font-black uppercase mb-8 leading-[0.8]">
                JOIN THE <br><span class="text-[#0066bf]">CULT.</span>
            </h3>
            <p class="font-mono text-xs text-gray-400 mb-12 max-w-md">
                Accès exclusif aux drops limités Bylin Style et aux événements privés à Cotonou. Ne manquez pas la prochaine vague.
            </p>
            <form class="flex border-b border-white/30 pb-4 group focus-within:border-[#0066bf] transition-colors" @submit.prevent>
                <input type="email" placeholder="VOTRE EMAIL" class="bg-transparent w-full outline-none font-syne text-xl md:text-2xl uppercase placeholder:text-white/20" />
                <button class="text-xs font-mono uppercase text-[#0066bf] hover:text-white transition-colors hover-trigger" @mouseenter="onHoverEnter" @mouseleave="onHoverLeave">S'inscrire</button>
            </form>
            
            <div class="mt-16 flex gap-8">
                <a href="#" class="font-mono text-xs uppercase hover:text-[#0066bf] transition-colors">Instagram</a>
                <a href="#" class="font-mono text-xs uppercase hover:text-[#0066bf] transition-colors">TikTok</a>
                <a href="#" class="font-mono text-xs uppercase hover:text-[#0066bf] transition-colors">WhatsApp</a>
            </div>
            </div>

            <!-- Footer Links -->
            <div class="w-full lg:w-1/2 flex flex-col justify-between">
            <div class="grid grid-cols-2 gap-8 mb-12">
                <div>
                    <h4 class="font-mono text-[10px] uppercase text-[#0066bf] mb-4">Navigation</h4>
                    <ul class="space-y-2 font-syne font-bold uppercase text-lg">
                        <li><a href="#" class="hover:text-[#0066bf] transition-colors">Shop</a></li>
                        <li><a href="#" class="hover:text-[#0066bf] transition-colors">Collections</a></li>
                        <li><a href="#" class="hover:text-[#0066bf] transition-colors">About</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="font-mono text-[10px] uppercase text-[#0066bf] mb-4">Légal</h4>
                    <ul class="space-y-2 font-mono text-xs text-gray-400">
                        <li><a href="#" class="hover:text-white transition-colors">Mentions Légales</a></li>
                        <li><a href="#" class="hover:text-white transition-colors">CGV</a></li>
                        <li><a href="#" class="hover:text-white transition-colors">Confidentialité</a></li>
                    </ul>
                </div>
            </div>
            <div class="text-right">
                <h2 class="font-syne font-black text-[15vw] lg:text-[10vw] leading-none text-[#1a1a1a]">BYLIN</h2>
            </div>
            </div>
        </div>
    </section>
</template>
