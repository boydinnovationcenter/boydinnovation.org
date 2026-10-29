/**
 * Renders the small subset of Markdown allowed in content files:
 * ***bold italic***, **bold**, *italic* and [links](https://…). Everything
 * else is escaped. Links to other sites open in a new tab and say so to
 * screen readers.
 */
export function inlineMarkdown(text: string): string {
	return text
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
		.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
		.replace(/\*(.+?)\*/g, '<em>$1</em>')
		.replace(/\[(.+?)\]\(((?:https?:\/\/|\/)[^\s)]+)\)/g, (_, label: string, href: string) =>
			href.startsWith('/')
				? `<a href="${href}">${label}</a>`
				: `<a href="${href}" target="_blank" rel="noopener">${label}<span class="visually-hidden"> (opens in a new tab)</span></a>`,
		);
}
