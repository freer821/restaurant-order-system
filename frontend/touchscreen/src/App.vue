<template>
  <div id="app">
    <TopLogo />
    <router-view class="view-router"></router-view>
    <router-view name="tabbar"></router-view>
  </div>
</template>
<script>
import TopLogo from '@/components/TopLogo';
export default {
	name: 'app',
	components: { TopLogo }
};
</script>
<style lang="scss" src="@/assets/scss/global.scss" />