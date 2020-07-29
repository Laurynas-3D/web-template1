Vue.component('product', {
    template: `
            <div class="product">
                <div class="product-image">
                    <img v-bind:src="image">
                </div>

                <div class="product-info">
                    <h2>{{ title }}</h2>
                    <p v-if="inStock">In Stock</p>
                    <p v-else  
                       :class="{ outOfStock: !inStock}">Out of Stock</p>
                    <p class="onSale"> {{ sale }}</p>
                    <ul>
                        <li v-for="detail in details">{{detail}}</li>
                    </ul>
                    <div v-for="(variant, index) in variants" 
                         :key="variant.variantId"
                         class="color-box" 
                         :style="{ backgroundColor: variant.variantColor}" 
                         @mouseover="updateProduct(index)">
                    </div>

                    <button v-on:click="addToCart()" 
                            :disabled="!inStock"
                            :class="{ disabledButton: !inStock }">Add to cart</button>
                    <div class="cart">
                        <p>Cart({{cart}})</p>
                    </div>
                </div>
            </div>
`,
    data() {
    return {
        brand: 'Vue',
        product: 'Mug',
        message: 'Hello World with Vuejs!',
        onSale: true,
        selectedVariant: 0,
        details: ["Ceramic coffee mug", "325mL", "microwave and oven safe"],
        variants: [{variantId: 1,variantColor: "Yellow", variantImage:"./img/cup-yellow.png", variantQuantity:10},
                   {variantId: 2,variantColor: "Green", variantImage:"./img/cup-green.png", variantQuantity:2},
                   {variantId: 3,variantColor: "Red", variantImage:"./img/cup-red.png", variantQuantity:0}],
        cart: 0

    }  // end data return
}, //end data
    
    methods: {
        addToCart(){
            this.cart += 1
        },

        updateProduct(index) {
            this.selectedVariant = index
            console.log(index)
        }

    }, //end methods:

    computed: {
        title(){
            return this.brand + ' ' + this.product
        },
        image(){
            return this.variants[this.selectedVariant].variantImage
        },
        inStock(){
            return this.variants[this.selectedVariant].variantQuantity
        },
        sale(){
            if (this.onSale){
            return this.brand + ' ' + this.product + ' are on sale!'
            }
            return this.brand + ' ' + this.product + ' are not on sale!'
        },
    } // end computed
})

    
    
    
new Vue({
    el: '#app',
   
});

new Vue({
    el: '#svgTest',
    data: {
        image: './svg-blue.svg',
        inStock: false,
        variants: [{variantColor: "Blue", variantImage:"./svg-blue.svg"},
                   {variantColor: "Yellow", variantImage:"./svg-yellow.svg"},
                   {variantColor: "Red", variantImage:"./svg-red.svg"}],
    }, //end data

    methods: {
        switchColors: function (variantImage) {
            this.image = variantImage
        }
    } //end methods:


})