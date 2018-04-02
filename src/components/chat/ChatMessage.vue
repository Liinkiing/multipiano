<template>
    <li class="chat-message">
         {{ message.user.username }} : {{ message.body }}
    </li>
    
</template>

<script>
    import Message from '../../socket/models/Message'
    export default {
        name: 'chat-message',
        props: {
            message: {type: Message, required: true}
        }
    }
</script>

<style lang="scss">

</style>