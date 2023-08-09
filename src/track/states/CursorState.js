import {pixelsToSeconds} from "../../utils/conversions";
/* OLD:
export default class {
  constructor(track) {
    this.track = track;
  }

  setup(samplesPerPixel, sampleRate) {
    this.samplesPerPixel = samplesPerPixel;
    this.sampleRate = sampleRate;
  }

  click(e) {
    e.preventDefault();

    const startX = e.offsetX;
    const startTime = pixelsToSeconds(
      startX,
      this.samplesPerPixel,
      this.sampleRate
    );

    this.track.ee.emit("select", startTime, startTime, this.track);
  }

  static getClass() {
    return ".state-cursor";
  }

  static getEvents() {
    return ["click"];
  }
}*/

export default class {
    constructor(track) {
        this.track = track;
        this.active = false;
        this.bounds = null;
    }

    setup(samplesPerPixel, sampleRate) {
        this.samplesPerPixel = samplesPerPixel;
        this.sampleRate = sampleRate;

        // document.addEventListener("mouseup", this.globalMouseUp.bind(this));
    }

    emitSelection(x) {
        const trackStart = this.track.getStartTime();
        const trackEnd = this.track.getEndTime();
        const timeX = pixelsToSeconds(
            x,
            this.samplesPerPixel,
            this.sampleRate
        );
        const clampX = Math.max(trackStart, Math.min(timeX, trackEnd));

        this.track.ee.emit("select", clampX, clampX, this.track);
    }

    // mousedown(e) {
    //     e.preventDefault();
    //     this.emitSelection(e.offsetX);
    //     this.active = true;
    // }
    //
    // mousemove(e) {
    //     if (this.active) {
    //         e.preventDefault();
    //         this.emitSelection(e.offsetX);
    //     }
    // }
    //
    // mouseup(e) {
    //     if (this.active) {
    //         e.preventDefault();
    //         this.emitSelection(e.offsetX);
    //         this.active = false;
    //     }
    // }

    // mouseleave(e) {
    //     if (this.active) {
    //         e.preventDefault();
    //         this.emitSelection(e.offsetX); // TODO: listen to mouseup globally and delete mouseleave event
    //         this.active = false;
    //     }
    // }

    pointerdown(e) {
        if (e.pointerType === "touch") return;

        this.bounds = e.target.getBoundingClientRect();
        if (!this.bounds) return;

        e.target.setPointerCapture(e.pointerId);
        const offsetX = e.clientX - this.bounds.x;

        e.preventDefault();
        this.emitSelection(offsetX);
        this.active = true;
    }

    pointermove(e) {
        if (e.pointerType === "touch") return;
        if (!this.bounds) return;

        if (this.active) {
            const offsetX = e.clientX - this.bounds.x;

            e.preventDefault();
            this.emitSelection(offsetX);
        }
    }

    pointerup(e) {
        if (e.pointerType === "touch") return;
        if (!this.bounds) return;

        e.target.releasePointerCapture(e.pointerId);
        const offsetX = e.clientX - this.bounds.x;

        e.preventDefault();
        this.emitSelection(offsetX);
        this.active = false;
    }

    touchstart(e) {
        const bounds = e.target.getBoundingClientRect();
        const touch = e.targetTouches[0] || e.changedTouches[0] || e.touches[0];
        if (!touch || !bounds) return;

        const offsetX = touch.clientX - bounds.x;

        e.preventDefault();
        this.emitSelection(offsetX);
        this.active = true;
    }

    touchmove(e) {
        if (this.active) {
            const bounds = e.target.getBoundingClientRect();
            const touch = e.targetTouches[0] || e.changedTouches[0] || e.touches[0];
            if (!touch || !bounds) return;

            const offsetX = touch.clientX - bounds.x;

            e.preventDefault();
            this.emitSelection(offsetX);
        }
    }

    touchend(e) {
        if (this.active) {
            const bounds = e.target.getBoundingClientRect();
            const touch = e.targetTouches[0] || e.changedTouches[0] || e.touches[0];
            if (!touch || !bounds) return;

            const offsetX = touch.clientX - bounds.x;

            e.preventDefault();
            this.emitSelection(offsetX);
            this.active = false;
        }
    }

    touchcancel(e) {
        if (this.active) {
            const bounds = e.target.getBoundingClientRect();
            const touch = e.targetTouches[0] || e.changedTouches[0] || e.touches[0];
            if (!touch || !bounds) return;

            const offsetX = touch.clientX - bounds.x;

            e.preventDefault();
            this.emitSelection(offsetX);
            this.active = false;
        }
    }

    static getClass() {
        return ".state-cursor";
    }

    static getEvents() {
        return ["pointerdown", "pointermove", "pointerup", "touchstart", "touchmove", "touchend", "touchcancel"];
    }
}
