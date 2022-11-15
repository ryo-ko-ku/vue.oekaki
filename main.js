
const COLORS = [
  { name: 'black', hex: '#000000'},
  { name: 'red', hex: '#f44336'},
  { name: 'pink', hex: '#E91E63'},
  { name: 'purple', hex: '#9C27B0'},
  { name: 'deeppurple', hex: '#673AB7'},
  { name: 'indigo', hex: '#3F51B5'},
  { name: 'blue', hex: '#2196F3'},
  { name: 'lightblue', hex: '#03A9F4'},
  { name: 'cyan', hex: '#00BCD4'},
  { name: 'teal', hex: '#009688'},
  { name: 'green', hex: '#4CAF50'},
  { name: 'lightgreen', hex: '#8BC34A'},
  { name: 'lime', hex: '#CDDC39'},
  { name: 'yellow', hex: '#FFEB3B'},
  { name: 'amber', hex: '#FFC107'},
  { name: 'orange', hex: '#FF9800'},
  { name: 'deeporange', hex: '#FF5722'},
  { name: 'brown', hex: '#795548'},
  { name: 'grey', hex: '#9E9E9E'}
];

const randomIndex = (max) => {
  return Math.floor(Math.random() * max);
}

const BASE = COLORS[randomIndex(COLORS.length)];

Vue.component('pixel', {
  template: `
  <div id="pixel">
    <div class="pixel"
         @mouseover="mouseOver"
         @animationend="removeFade"
         :class="{ 'fade' : fade }"
         :style="{ 'background-color': color.hex }" />
  </div>
  `,
  props: [ 'color', 'selected', 'iterate' ],
  data: () => ({ fade: false }),
  methods: {
    mouseOver(event) {
      if (this.fade){
        this.fade = false;
      }
      
      if (this.iterate) {
        let count = 0;
        const interval = setInterval(() => {
          this.color = COLORS[randomIndex(COLORS.length)];
            count++;
            if (count > 10){
              clearInterval(interval);
              this.fade = true;
            }
        }, 50);
      } else {
        this.color = this.selected;
        this.fade = true;
      }
    },
    removeFade(event) {
      this.color = BASE;
      this.fade = false;
    }
  }
});

Vue.component('playground', {
  template: `
    <div id="playground" :style="{ 'background-color': color.hex }">
      <div class="color-picker">
        <div v-for="c in colors">
          <div class="color"
               @click="setColor(c)"
               :class="{'active': selection.name === c.name }"
               :style="{ 'background-color': c.hex }"></div>
        </div>
        <button type="button" @click="randomize()">Random!</button>
        <button type="button" @click="loop()">Psycho</button>
      </div>
      <div class="container">
        <div v-for="pixel in grid" :key="pixel">
          <pixel :color="color" 
                 :selected="selection"
                 :iterate="iterate" />
        </div>
      </div>
    </div>
  `,
  data: () => ({
      color: BASE,
      selection: BASE,
      iterate: false,
      colors: COLORS,
      grid: Array.from({ length: 3000 }, (v, k) => k+1)
  }),
  methods: {
    setColor(color) {
      this.selection = color;
    },
    randomize() {
      this.selection = this.colors[randomIndex(this.colors.length)];
    },
    loop() {
      this.iterate = !this.iterate;
    }
  },
  mounted() {
    this.selection = COLORS.filter( x => x !== BASE )[randomIndex(COLORS.length - 1)];
  }
});

new Vue({ el: '#app', template: `<playground />` });