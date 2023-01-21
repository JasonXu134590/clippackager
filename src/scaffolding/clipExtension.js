const vm = require('vm');
const mime = require('mime-types');

async function addExtension(extData) {
    let instance;
    let info;
    if (!('info.json' in extData.files)) return;
    const content = await extData.files['info.json'].async('text');
    info = JSON.parse(content);
    if (info.icon) {
        const data = await extData.files[info.icon].async('arraybuffer');
        info.icon = URL.createObjectURL(new Blob(
            [data], { type: this.mime.lookup(info.icon) }
        ));
    }
    if (info.inset_icon) {
        const data = await extData.files[info.inset_icon].async('blob');
        info.inset_icon = URL.createObjectURL(new Blob(
            [data], { type: this.mime.lookup(info.inset_icon) }
        ));
    }
    info.api = 1;

    // Load extension class
    if ('main.js' in extData.files) {
        const script = new this.vm.Script(await extData.files['main.js'].async('text'));
        console.log(script);
        const ExtensionPrototype = script.runInThisContext();
        instance = new ExtensionPrototype();
    } else return;

    // locale and settings is unnecessary for packager

    await extensionManager.addInstance(info.id, info, instance);
}
module.exports = {
    addExtension,
    vm,
    mime
}