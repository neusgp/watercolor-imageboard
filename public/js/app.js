import * as Vue from "./vue.js";
import { myModal } from "./modal.js";
import { comments } from "./comments.js";

Vue.createApp({
    components: {
        "modal-comp": myModal,
        "comments-comp": comments,
    },
    data() {
        return {
            idToFetch: null,
            selectedImage: null,
            images: [],
            title: "",
            description: "",
            username: "",
            image: null,
            lowestId: "",
            moreimg: true,
            count: "",
        };
    },
    mounted() {
        console.log("slice url", location.pathname.slice(1));

        fetch("/api/images", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => {
                console.log("data: ", data);
                this.images = data;
                console.log("these are the images", data);
                data.forEach((item) => {
                    if (item.id == location.pathname.slice(1)) {
                        console.log("found url!");
                        this.idToFetch = location.pathname.slice(1);
                        history.pushState({}, "", "/" + this.idToFetch);
                    }
                });
            })
            .catch((err) => console.log("error fetching data", err));

        window.addEventListener("popstate", (e) => {
            console.log(location.pathname, e.state);
            // show whatever is appropriate for the new url
            history.pushState({}, "", location.pathname.slice(1));
            this.idToFetch = null;
        });
    },
    methods: {
        handleSubmit() {
            // Create your data with the right encoding
            const formData = new FormData();
            formData.append("title", this.title);
            formData.append("description", this.description);
            formData.append("username", this.username);
            formData.append("image", this.image);

            // Trigger an Ajax to the server:
            fetch("/image", {
                method: "POST",
                body: formData,
            }).then((res) => {
                res.json()
                    .then((data) => {
                        console.log("data:", data);
                        this.images = [data, ...this.images];
                    })
                    .catch((err) => {
                        console.log("error fetching data", err);
                    });
            });
        },
        handleFileChange(e) {
            console.log("Handle File Change");
            this.image = e.target.files[0];
        },
        onUserClick(image) {
            this.selectedImage = image;
            this.idToFetch = image.id;
            history.pushState({}, "", "/" + this.idToFetch);
            console.log("id:", this.idToFetch);
        },
        onClose() {
            this.idToFetch = null;
            history.pushState({}, "", "/");
        },
        onMore() {
            this.lowestId = this.images[this.images.length - 1].id;
            console.log(this.lowestId);

            const url = "/images/more/" + this.lowestId;
            fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((res) => res.json())
                .then((data) => {
                    /* data.forEach((image) => this.images.push(image)); */
                    this.images = [...this.images, ...data];
                    console.log("these are the new images", this.images);
                    if (data.length === 0) {
                        this.moreimg = false;
                    }
                    /*  this.getCount(); */
                });
        },
        getCount() {
            fetch("/images/count", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((res) => res.json())
                .then((data) => {
                    this.count = data;
                    console.log(this.count);
                })
                .catch((err) => console.log("error fetching data", err));
        },
        hideButton() {
            const img = this.images;
            if (this.count === img.length) {
                console.log("no more img");
                return false;
            }
            console.log("moreimgs!:", this.moreimg);
            return true;
        },
    },
}).mount("#app");
