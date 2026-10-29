/**
 * Build-time fixes for Markdown/MDX content (blog posts).
 *
 * 1. Headings: authors pick a heading size the way they did in Squarespace
 *    (## large, ### medium, #### small). The page already has the post title
 *    as its only <h1>, so levels are renumbered to run 2, 3, 4… without
 *    skipping, and an `is-h2`/`is-h3`/`is-h4` class keeps the chosen size.
 *    Example: a post that uses only ### gets <h2 class="is-h3">.
 * 2. Links to other sites open in a new tab, as on the live site, and say so
 *    to screen readers.
 */

const HEADING = /^h([1-6])$/;
const SITE_HOST = 'boydinnovation.org';

/** Read or write a class/attribute on both HTML elements and MDX JSX elements. */
function getAttr(node, name) {
	if (node.type === 'element') return node.properties?.[name === 'class' ? 'className' : name];
	return node.attributes?.find((a) => a.name === name)?.value;
}

function setAttr(node, name, value) {
	if (node.type === 'element') {
		node.properties ??= {};
		node.properties[name === 'class' ? 'className' : name] = value;
		return;
	}
	node.attributes ??= [];
	const existing = node.attributes.find((a) => a.name === name);
	if (existing) existing.value = value;
	else node.attributes.push({ type: 'mdxJsxAttribute', name, value });
}

function tagName(node) {
	if (node.type === 'element') return node.tagName;
	if (node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement') return node.name;
	return undefined;
}

function walk(node, visit) {
	visit(node);
	for (const child of node.children ?? []) walk(child, visit);
}

function addClass(node, cls) {
	const current = getAttr(node, 'class');
	const list = Array.isArray(current) ? current : current ? String(current).split(/\s+/) : [];
	const next = [...list, cls];
	setAttr(node, 'class', node.type === 'element' ? next : next.join(' '));
}

export default function rehypeBlog() {
	return (tree) => {
		// Stack of [authored level, output level] for the current section path.
		const stack = [];
		walk(tree, (node) => {
			const name = tagName(node);
			if (!name) return;

			const heading = HEADING.exec(name);
			if (heading) {
				const authored = Math.max(2, Number(heading[1]));
				while (stack.length && stack.at(-1)[0] >= authored) stack.pop();
				const level = stack.length ? stack.at(-1)[1] + 1 : 2;
				stack.push([authored, level]);
				addClass(node, `is-h${authored}`);
				if (node.type === 'element') node.tagName = `h${level}`;
				else node.name = `h${level}`;
				return;
			}

			if (name === 'a') {
				const href = String(getAttr(node, 'href') ?? '');
				let url;
				try {
					url = new URL(href);
				} catch {
					return;
				}
				if (!/^https?:$/.test(url.protocol) || url.hostname.endsWith(SITE_HOST)) return;
				setAttr(node, 'target', '_blank');
				setAttr(node, 'rel', 'noopener');
				node.children ??= [];
				node.children.push({
					type: 'element',
					tagName: 'span',
					properties: { className: ['visually-hidden'] },
					children: [{ type: 'text', value: ' (opens in a new tab)' }],
				});
			}
		});
	};
}
