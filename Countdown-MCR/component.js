// Receives the widget, widgetModule and entries as props.
export default {
	data() {
		return {
			counter_1: "",
			teamAname:"",
			color1: "",
			color2: "",
			scoreA: 0,
			scoreB: 0,
			teamBname:"",
			secondsRemaining: "",
			bgColor: "",
			target: moment()
		}
	},
	computed: {
		running() {
			return this.widget.props.running
		},
		cssVars() {
			return {
			  'background': this.bgColor // HERE IS THE CSS FOR RED BOX
			}
		  },
		  solidColorStyleA() {  								//HERE IS THE CODE TO EXCHANGE THE PROPS FROM INDEX TO COMPONENT
			return {
				colorA: this.widget.props.color1,
				
				"background": this.widget.props.color1,
				
			}
		},

		solidColorStyleB() {  								//HERE IS THE CODE TO EXCHANGE THE PROPS FROM INDEX TO COMPONENT
			return {
				
				colorB: this.widget.props.color2,
				
				"background": this.widget.props.color2,
			}
		}
		  
	},
	watch: {
		running: function(isRunning, wasRunning) {
			if (wasRunning && !isRunning) {
				this.secondsRemaining = this.target.diff(moment(), "seconds")
			}
			if (!wasRunning && isRunning) {
				this.setTarget()
				this.setcounter_1()
			}
		}
	},
	mounted() {
		var msIn = this.widget.props.seconds.toString() 
		this.secondsRemaining = Number(- + msIn.split(':').reduce((acc,time) => (60 * acc) + +time)) //this.widget.props.seconds
		this.setTarget()
		this.setcounter_1()
		this.setTeam()
		this.setScore()
		this.setRedBg()
		this.setTeamColor() 
	},
	sockets: {
		state() {
			this.$nextTick(() => {
				if (this.running) this.setcounter_1()
				
			})
		}
	},
	methods: {
		setTeamColor: function() { 							//HERE IS THE FUNCTION TO SET THE TEAMS COLOURS 
			this.colorA = this.widget.props.color1
			this.colorB = this.widget.props.color2
			//console.log(this.colorA)
			//console.log(this.colorB)
			
		},

		setRedBg: function() {
			if (this.widget.props.redbtn !== false) {
				this.bgColor = "#b21111"
			} else {
				this.bgColor = ""
			}
			setTimeout(this.setRedBg, 500)
		},
		setScore: function() {
			if (this.widget.props.scoreA !== "") {
				this.scoreA = this.widget.props.scoreA
				this.scoreB = this.widget.props.scoreB
			} 
			setTimeout(this.setScore, 500)
		},
		setTeam: function() {
			if (this.widget.props.teamAname !== "") {
				this.teamAname = this.widget.props.teamAname
				this.teamBname = this.widget.props.teamBname
			} 
			setTimeout(this.setTeam, 500)
		},
		setTarget: function() {
			if (this.widget.props.type === "timer") {
				//var msIn = this.widget.props.seconds.toString() 
				//this.target = moment().add(- + msIn.split(':').reduce((acc,time) => (60 * acc) + +time),"s") //this.widget.props.seconds == input of time in seconds
				this.target = moment().add(this.secondsRemaining, "s")
				console.log("Left in seconds:", this.secondsRemaining)
			} else {
				var msIn = this.widget.props.seconds.toString()
				this.target = moment().add(msIn.split(':').reduce((acc,time) => (60 * acc) + +time),"s")
			}
		},
		setcounter_1: function() {
			// Get the time between now and the target time
			var now = moment()

			if (now.isAfter(this.target) && this.widget.props.count_up) {
				var duration = moment.duration(now.diff(this.target))
			} else if (now.isAfter(this.target) && !this.widget.props.count_up) {
				var duration = moment.duration(0)
			} else {
				var duration = moment.duration(this.target.diff(now))
			}

			// Calculate parts
			var S = Math.floor((duration / 1000) % 60)
			var M = Math.floor((duration / 1000 / 60) % 999999)
			var H = Math.floor((duration / (1000 * 60 * 60)) % 24)
			var D = Math.floor(duration / (1000 * 60 * 60 * 24))

			// Add leading zeroes
			var SS = S.toString().padStart(2, "0")
			var MM = M.toString().padStart(2, "0")
			var HH = H.toString().padStart(2, "0")
			var DD = D.toString().padStart(2, "0")

			function applyFormat(string) {
				string = string.replace("$DD", DD)
				string = string.replace("$HH", HH)
				string = string.replace("$MM", MM)
				string = string.replace("$SS", SS)
				string = string.replace("$D", D)
				string = string.replace("$H", H)
				string = string.replace("$M", M)
				string = string.replace("$S", S)
				return string
			}

			if (this.widget.props.format === "custom") {
				this.counter_1 = applyFormat(this.widget.props.customformat)
			} else if (this.widget.props.format === "humanize") {
				if (now.isAfter(this.target) && !this.widget.props.count_up)
					this.counter_1 = "now"
				else if (now.isAfter(this.target) && this.widget.props.count_up)
					this.counter_1 = moment.duration(-duration).humanize(true)
				else this.counter_1 = duration.humanize(true)
			} else {
				this.counter_1 = applyFormat(this.widget.props.format)
			}

			if (!this.running) return
			setTimeout(this.setcounter_1, 100)
		}  
	}
}
