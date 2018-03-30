<template>
    <li class="user-badge" :style="style">
        {{ user.username }}
    </li>
    
</template>

<script>
    export default {
        name: 'user-badge',
        props: {
            user: {type: Object, required: true}
        },
        computed: {
            style () {
                return {
                    'background-color': this.user.color
                }
            }
        }
    }
</script>

<style lang="scss">
    .user-badge {
        list-style: none;
        padding: 10px 20px;
        border-radius: 5px;
        display: inline-block;
        margin: 10px 20px;
        &:first-of-type {
            margin-left: 0;
        }
        &:last-of-type {
            margin-right: 0;
        }
    }
</style>