class UserInput {
    constructor(_prefix, _suffix) {
        this.value = "";
        this.prefix = _prefix;
        this.suffix = _suffix;
    }


    /**
     * trim, lowercase etc.
     */
    getPretty() {
        return this.value.trim().toLowerCase();
    }

    /**
     * Returns the input string to display, pre + val + suf
     */ 
    getDisplay(show_suffix = true) {
        let value_final = this.prefix + this.value + (show_suffix ? this.suffix : "" );
        return value_final;
    }

    /**
     * Resets input
     */
    clear() {
        this.value = "";
    }

    /**
     * Simulates the backspace function
     */
    backspace() {
        this.value = this.value.slice(0, this.value.length-1);
    }    
    
}