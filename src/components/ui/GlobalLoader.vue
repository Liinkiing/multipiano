<template>
    <transition name="fade">
        <div v-if="loading" class="fullscreen-loader">
            <div class="inner-content">
                <img src="../../assets/images/loader.svg" class="loader-icon" alt="">
                <p class="loader-message" v-if="message">{{ message }}</p>
            </div>
        </div>
    </transition>
</template>

<script>
    import { mapState } from 'vuex'
    export default {
        name: 'global-loader',
        computed: {
            ...mapState('app', {
                loading: state => state.loader.loading,
                message: state => state.loader.message
            })
        }
    }
</script>

<style lang="scss">
    @keyframes introduction {
        0% {
            opacity: 0;
            transform: translateY(-20px);
        }
        100% {
            opacity: 1;
            transform: translateY(0)
        }
    }
    .fullscreen-loader {
        display: flex;
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: 300;
        background: rgba(0, 0, 0, 0.45);
        justify-content: center;
        align-items: center;
        & .inner-content {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            & .loader-icon {
                width: 64px;
                height: 64px;
                animation: introduction .5s;
            }
            & .loader-message {
                animation: introduction .5s;
            }
        }

    }
</style>