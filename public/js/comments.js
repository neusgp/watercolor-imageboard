const comments = {
    props: ["image_id"],
    data() {
        return {
            show: false,
            comments: [],
            username: "",
            comment: "",
        };
    },
    template: `<div class="image-comments">

    <div v-if="show">
    <ul style="overflow:scroll;" >       
        <li v-for="item in comments" class="c-items">
            <p class="un">{{item.username}} on <time>{{ formatDate(item.created_at) }}</time> says:</p>
            <p class="uc">{{item.comment}}</p>            
        </li>
    </ul>
    </div>
    <div v-else>
    </div>
    
    <form  @submit.prevent="getFormValues" class="commentsform">
    <p>Leave a comment</p>    
    <input type="text" name="comment">
    <p>Username</p>
    <input type="text" name="username">
    <button type="submit" >Submit</button>
    </form>
    

    
</div>`,
    mounted() {
        const url = "/comments/" + this.image_id;
        fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data[0]) {
                    console.log("response comments", data);
                    this.comments = data;
                    this.show = true;

                    return;
                }
                this.show = false;
            })
            .catch((err) => console.log("error fetching data", err));
    },

    methods: {
        formatDate(date) {
            return new Date(date).toLocaleString();
        },
        getFormValues(e) {
            this.comment = e.target.elements.comment.value;
            this.username = e.target.elements.username.value;
            console.log("comment:", this.comment, "username:", this.username);

            const data = {
                image_id: this.image_id,
                comment: this.comment,
                username: this.username,
            };

            const url = "/comments/" + this.image_id;
            fetch(url, {
                body: JSON.stringify(data),
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((res) => res.json())
                .then((data) => {
                    console.log("response comments", data);
                    this.comments = [...this.comments, ...data];
                    this.show = true;
                })
                .catch((err) => console.log("error fetching data", err));
        },
    },
};

export { comments };
