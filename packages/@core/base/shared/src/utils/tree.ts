interface TreeConfigOptions {
  /** نام فیلد فرزندان */
  childProps: string;
}

/**
 * پیمایش درخت و جمع‌آوری مقادیر
 */
function traverseTreeValues<T, V>(
  tree: T[],
  getValue: (node: T) => V,
  options?: Partial<TreeConfigOptions>,
): V[] {
  const result: V[] = [];
  const { childProps = 'children' } = options || {};
  const dfs = (nodes: T[]) => {
    for (const node of nodes) {
      result.push(getValue(node));
      const children = (node as any)?.[childProps] as T[] | undefined;
      if (children && children.length > 0) dfs(children);
    }
  };
  dfs(tree);
  return result;
}

/**
 * فیلتر درخت: گره‌هایی که شرط را ندارند (با فرزندانشان) حذف می‌شوند
 */
function filterTree<T extends Record<string, any>>(
  tree: T[],
  filter: (node: T) => boolean,
  options?: Partial<TreeConfigOptions>,
): T[] {
  const { childProps = 'children' } = options || {};
  const _filterTree = (nodes: T[]): T[] =>
    nodes.filter((node) => {
      if (filter(node)) {
        if (node[childProps]) {
          (node as any)[childProps] = _filterTree(node[childProps]);
        }
        return true;
      }
      return false;
    });
  return _filterTree(tree);
}

/**
 * نگاشت درخت به درختی جدید (والد هم به تابع داده می‌شود)
 */
function mapTree<T, V extends Record<string, any>>(
  tree: T[],
  mapper: (node: T, parent?: V) => V,
  options?: Partial<TreeConfigOptions>,
): V[] {
  const { childProps = 'children' } = options || {};
  const walk = (nodes: T[], parent?: V): V[] =>
    nodes.map((node) => {
      const mapped = mapper(node, parent);
      const children = (node as any)?.[childProps] as T[] | undefined;
      if (children && children.length > 0) {
        (mapped as any)[childProps] = walk(children, mapped);
      }
      return mapped;
    });
  return walk(tree);
}

/**
 * مرتب‌سازی درخت به‌صورت بازگشتی
 */
function sortTree<T extends Record<string, any>>(
  treeData: T[],
  sortFunction: (a: T, b: T) => number,
  options?: Partial<TreeConfigOptions>,
): T[] {
  const { childProps = 'children' } = options || {};
  return [...treeData].sort(sortFunction).map((item) => {
    const children = item[childProps];
    if (children && Array.isArray(children) && children.length > 0) {
      return { ...item, [childProps]: sortTree(children, sortFunction, options) };
    }
    return item;
  });
}

/**
 * جست‌وجوی اولین گره‌ای که شرط را دارد
 */
function findTreeNode<T extends Record<string, any>>(
  tree: T[],
  predicate: (node: T) => boolean,
  options?: Partial<TreeConfigOptions>,
): T | undefined {
  const { childProps = 'children' } = options || {};
  for (const node of tree) {
    if (predicate(node)) return node;
    const children = node[childProps] as T[] | undefined;
    if (children?.length) {
      const found = findTreeNode(children, predicate, options);
      if (found) return found;
    }
  }
  return undefined;
}

/**
 * تبدیل فهرست تخت به درخت بر اساس id/pid
 */
function listToTree<T extends Record<string, any>>(
  list: T[],
  { id = 'id', pid = 'pid', children = 'children' } = {},
): T[] {
  const map = new Map<any, T>();
  const roots: T[] = [];
  list.forEach((item) => map.set(item[id], { ...item, [children]: [] }));
  map.forEach((item) => {
    const parent = map.get(item[pid]);
    if (parent) (parent as any)[children].push(item);
    else roots.push(item);
  });
  return roots;
}

export {
  filterTree,
  findTreeNode,
  listToTree,
  mapTree,
  sortTree,
  traverseTreeValues,
};
export type { TreeConfigOptions };
