<style scoped>
.ivu-layout-header,
#baseNav {
    height: 55px;
}

.layout {
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
}

.layout-logo {
    width: 100px;
    height: 30px;
    background: #5b6270;
    border-radius: 3px;
    float: left;
    position: relative;
    top: 15px;
    left: 20px;
}

.layout-nav {
    width: 580px;
    margin: 0 auto;
    margin-right: 20px;
}

.ivu-menu-item {
    padding: 0px 20px;
    height: 55px;
}

.layout-nav .ivu-menu-item-active.ivu-menu-item-selected {
    background-color: #40a9ff;
    padding: 0px 20px;
}

.ivu-spin-fix {
    z-index: 9999;
}

.demo-spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
}
</style>
<template>
    <div class="layout">
        <Layout>
            <Header :style="{position: 'fixed', width: '100%'}">
                <Menu id="baseNav" mode="horizontal" theme="dark" :active-name="defaultMenu">
                    <div class="layout-logo"></div>
                    <div class="layout-nav">
                        <router-link to="/">
                            <MenuItem name="1">
                            <Icon type="ios-navigate"></Icon>
                            首页
                            </MenuItem>
                        </router-link>
                        <router-link to="/MenuMgr">
                            <MenuItem name="2">
                            <Icon type="ios-keypad"></Icon>
                            菜单管理
                            </MenuItem>
                        </router-link>
                        <router-link to="/Resources">
                            <MenuItem name="3">
                            <Icon type="cube"></Icon>
                            资源管理
                            </MenuItem>
                        </router-link>
                        <router-link to="/AuthorityMgr">
                            <MenuItem name="4">
                            <Icon type="ios-analytics"></Icon>
                            权限管理
                            </MenuItem>
                        </router-link>
                        <router-link to="/UserMgr">
                            <MenuItem name="5">
                            <Icon type="ios-paper"></Icon>
                            用户管理
                            </MenuItem>
                        </router-link>
                    </div>
                </Menu>
            </Header>
            <Content :style="{margin: '60px 20px 0', background: '#fff', minHeight: '500px'}">
                <Card>
                    <div style="min-height: 600px;">
                        <router-view/>
                    </div>
                    <Spin fix size="large" v-if="spinShow">
                        <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
                        <div>loading...</div>
                    </Spin>
                </Card>
            </Content>
        </Layout>
    </div>
</template>
<script>
export default {
    created() {
        this.defaultMenu = this.getdefaultMenu();
    },

    beforeMount() {
    },

    data() {
        return {
            defaultMenu: '1',
            spinShow: false
        }
    },
    methods: {
        getdefaultMenu() {
            let url = this.$route.name;
            let cont = {
                '': '1',
                'MenuMgr': '2',
                'Resources': '3',
                'AuthorityMgr': '4',
                'UserMgr': '5'
            }
            return cont[url];
        },

        loadshow() {
            this.spinShow = true;
        },

        loadhide() {
            this.spinShow = false;
        },
    }
}

</script>