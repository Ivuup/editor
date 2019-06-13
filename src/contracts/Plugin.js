export default class Plugin {
	exec(command, editor) {
		return this[command](editor)
	}
}