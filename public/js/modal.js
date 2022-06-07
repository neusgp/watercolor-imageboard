import { comments } from "./comments.js";

const myModal = {
    components: {
        "comments-comp": comments,
    },
    props: ["id"],
    methods: {
        onCloseClick() {
            this.$emit("close");
        },
    },
    data() {
        return {
            image: [],
        };
    },

    template: `<div class="cortina">
    <div class="image-detail">
    <img :src="image.url" :alt="image.title">
    <div class="imageinfo">
    <h1>{{ image.title }}</h1>    
    <p>{{image.description}}</p>
<comments-comp :image_id="id"></comments-comp>
</div>
<button @click="onCloseClick">Close</button>
</div>

</div>`,

    mounted() {
        const url = "/image/" + this.id;
        fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => {
                console.log("response data", data[0]);
                this.image = data[0];
            })
            .catch((err) => console.log("error fetching data", err));
    },
};

export { myModal };
