export const useWishlist = () => {
    const items = useState<string[]>('wishlist-items', () => [])
    
    // Initialize from localStorage on client side
    onMounted(() => {
        const stored = localStorage.getItem('bylin_wishlist')
        if (stored) {
            try {
                items.value = JSON.parse(stored)
            } catch (e) {
                console.error('Failed to parse wishlist', e)
            }
        }
    })

    // Watch for changes to save to localStorage
    watch(items, (newItems) => {
        localStorage.setItem('bylin_wishlist', JSON.stringify(newItems))
    }, { deep: true })

    const addToWishlist = (productId: string | number) => {
        const id = String(productId)
        if (!items.value.includes(id)) {
            items.value.push(id)
        }
    }

    const removeFromWishlist = (productId: string | number) => {
        const id = String(productId)
        const index = items.value.indexOf(id)
        if (index > -1) {
            items.value.splice(index, 1)
        }
    }

    const isInWishlist = (productId: string | number) => {
        return items.value.includes(String(productId))
    }

    const toggleWishlist = (productId: string | number) => {
        if (isInWishlist(productId)) {
            removeFromWishlist(productId)
        } else {
            addToWishlist(productId)
        }
    }

    return {
        items,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        toggleWishlist
    }
}
