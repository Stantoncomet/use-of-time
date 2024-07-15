class Command {
    constructor(_id, _aliases, _action, _sub_cmds) {
        this.id = _id;
        this.aliases = _aliases;
        this.action = _action;
        this.sub_cmds = _sub_cmds;
    }

    act(...args) {
        this.action(...args);
    }
    
}