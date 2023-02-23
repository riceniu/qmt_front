<template>
  <div class="components-container">
    <split-pane split="horizental">
      <template slot="paneT">
        <split-pane split="vertical">
          <template slot="paneNo">
            <div class="top-container">
              <p>QuoteNo.:</p>
            </div>
          </template>
          <template slot="paneDate">

          </template>
        </split-pane>
      </template>
      <template slot="paneB">
        <split-pane split="vertical">
          <template slot="paneL">
            <div class="top-container">
              <p>zzzzzz</p>
            </div>
          </template>
          <template slot="paneR">
            <div class="bottom-container" >
              <h2>h2</h2>
              </div>
          </template>
        </split-pane>
      </template>
    </split-pane>
  </div>
</template>

<script>
import splitPane from "vue-splitpane";

export default {
  name: "report-template",
  components: { splitPane },
  mounted() {
    //window.print()
  },
  methods: {
    resize() {
      console.log("resize");
    },
  },
};
</script>

<style  scoped>
.components-container {
  position: relative;
  height: 100vh;
}

.left-container {
  background-color: #f38181;
  height: 100%;
}

.right-container {
  background-color: #fce38a;
  height: 200px;
}

.top-container {
  background-color: #fce38a;
  width: 100%;
  height: 100%;
}

.bottom-container {
  width: 100%;
  background-color: #95e1d3;
  height: 100%;
}
</style>
