<template>
    <div class="home-container">
        <NavBar />
        <div class="main-container">
            <div>
                <ConnView />
                <FileView class="file-container" />
            </div>

            <div class="main-view-container">
                <MainView />
            </div>


        </div>
    </div>
</template>
    
<script setup lang='ts'>
</script>
    
<style lang="less">
.home-container {
    height: 100vh;

    .main-container {
        height: 88vh;
        padding: 10px;
        display: flex;

        .file-container {
          margin-top: 10px;
        }

        .main-view-container {
            overflow: hidden;
            // flex: 1;
            width: calc(100% - 280px);
            margin-left: 10px;
            box-shadow: 2px 2px 10px rgba(90, 89, 89, 0.2);
            background-color: rgba(254, 254, 254, 0.745);
            border-radius: 10px;
        }
    }
}
</style>