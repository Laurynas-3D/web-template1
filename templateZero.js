var eventBus = new Vue()
Vue.component('product', {
    props:{
        premium: {
            type: Boolean,
            required: true
        }
    },
    template: `
        <div class="product">
                <div class="product-image">
                    <img v-bind:src="image">
                </div>

                <div class="product-info">
                    <h1 style="margin-bottom:20px"> {{ title }} </h1>
                    <p v-if="inStock">In Stock</p>
                    <p v-else  
                        :class="{ outOfStock: !inStock}">Out of Stock</p>
                    <p>Shipping: {{ shipping }} </p>
                    <p class="onSale"> {{ sale }}</p>

                    <ul class="product-details">
                        <li v-for="detail in details" :key="detail"> {{ detail }} </li>
                    </ul>

                    <p style="margin-top:20px">Available colors: </p>
                    <div v-for="(variant, index) in variants" 
                        :key="variant.variantId"
                        class="color-box" 
                        :style="{ backgroundColor: variant.variantColor}" 
                        @mouseover="updateProduct(index)">
                    </div>
                    <br>
                    <button v-on:click="addToCart()" 
                            :disabled="!inStock"
                            :class="{ disabledButton: !inStock }"
                            class="btn-add-to-cart"
                            >
                            Add to cart
                    </button>

                    <productTabsComp :reviews="reviews"></productTabsComp>

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
            variants: [ 
                {variantId: 1001,variantColor: "Gold",    variantImage:"./img/graphics/cup-yellow.png",  variantQuantity: 10},
                {variantId: 1002,variantColor: "ForestGreen",     variantImage:"./img/graphics/cup-green.png",   variantQuantity: 2},
                {variantId: 1003,variantColor: "Tomato",       variantImage:"./img/graphics/cup-red.png",     variantQuantity: 0}
                ],
            reviews: [],
        } // end data return
    }, //end data
    
    methods: {
        addToCart(){
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId)
        },

        updateProduct(index) {
            this.selectedVariant = index
            // console.log(index)
        },

        // UNUSED; instead we will use mounted()
        // addReview(productReview) {
        //     this.reviews.push(productReview)
        // }
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
            return this.brand + ' ' + this.product + ' is on sale!'
            }
            return this.brand + ' ' + this.product + ' is not on sale!'
        },
        shipping(){
            if (this.premium) {
                return "Free"
            }
            return 2.99
        },
    }, // end computed
    
    // New method with eventBUS
    mounted(){
        eventBus.$on('reviewSubmitted', productReview => {this.reviews.push(productReview)})
    } // end mounted
}) // end product component

Vue.component('productReviewComp',{
    template:`
    <div>
        <!-- .prevent is a event modifier, this will prevent default behaviour, the page will not refresh when we press submit this form -->
        <form class="submit-review-form" @submit.prevent="onSubmit">
            <p class="error" v-if="errors.length">
                <b>please correct the following error(s)</b>
                <ul>
                    <li v-for="error in errors" :key="error"> {{error}} </li>
                </ul>
            </p>
            <p>
                <label for="name">Name:</label>
                <input class="color_field" id="name" v-model="name">
            </p>
            <p>
                <label for="review">Review:</label>
                <textarea class="color_field" id="review" v-model="review"></textarea>
            </p>
            <p>
                <label for="rating">Rating:</label>
                <!-- .number is a modier that will make sure typecast this value as a number -->
                <select id="rating" v-model.number="rating">
                    <option value=" 5">5</option>
                    <option value=" 4">4</option>
                    <option value=" 3">3</option>
                    <option value=" 2">2</option>
                    <option value=" 1">1</option>
                </select>
            </p>
            <p>
                <input class="submit-button" type="submit" value="Submit">
            </p>
        </form>
    </div>
`,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            errors: []
        }
    }, // end data
    methods: {
        onSubmit(){
            this.errors = []
            if (this.name && this.review && this.rating) {
            let productReview = {
                name: this.name,
                review: this.review,
                rating: this.rating
            }
            // our values are reset whenever we submit this form
            eventBus.$emit('reviewSubmitted', productReview)
            this.name = null
            this.review = null
            this.rating = null
            }
            else{
                if (!this.name) this.errors.push("Name required.")
                if (!this.review) this.errors.push("Review required.")
                if (!this.rating) this.errors.push("Rating required.")
            }
        }
    }, // end methods
}) // end productReviewComp component

Vue.component('productTabsComp',{
    props: {
        reviews:{
            type: Array,
            required: true
        }
    }, // end props
    template:`
        <div>
        <span class="tab"
        :class="{ activeTab: selectedTab === tab}"
        v-for="(tab, index) in tabs" 
        :key="index"
        @click="selectedTab = tab"> {{ tab }}
        </span>

        <div class="review-form"
            v-show="selectedTab === 'Reviews'">
            <!-- <h2>Reviews</h2> -->
            <p v-if="!reviews.length">There are no reviews yet.</p>
            <ul class="rf-background" v-else>
                <li v-for="review in reviews" :key="review">
                <p>{{ review.name }}</p>
                <p>Rating: {{ review.rating }}</p>
                <p>{{ review.review }}</p>
                </li>
            </ul>
        </div>
        
        <productReviewComp v-show="selectedTab === 'Make a Review'"></productReviewComp>

    </div>
    `,
    data() {
        return {
            tabs: ['Reviews', 'Make a Review'],
            selectedTab: 'Reviews'
        }
    } // end data    
}) // end productTabsComp component

    
new Vue({
    el: '#app',
    data: {
        premium: true,
        cart: []
    },
    methods:{
        updateCart(id){
            this.cart.push(id)
        },
    },
});

