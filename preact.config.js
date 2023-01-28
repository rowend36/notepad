/**
 * @param {import('preact-cli').Config} config - Original webpack config
 * @param {import('preact-cli').Env} env - Current environment info
 * @param {import('preact-cli').Helpers} helpers - Object with useful helpers for working with the webpack config
 */

export default (config, env, helpers) => {
  // Add this plugin which appears to do nothing
  const [, , babelConfig] = loaders(config, "babel-loader").next().value;
  babelConfig.options.plugins.push(
    require.resolve("@babel/plugin-transform-react-jsx-source")
  );

  for (const [, , conf] of loaders(config, "css-loader")) {
    if (conf.options.modules) {
      conf.options.modules.auto = true;
      break;
    }
  }
};
const loaders = (config, name) =>
  walk(
    config.module.rules,
    (type, path, value) =>
      type === "string" &&
      /(^|\/use)(\/\d+)?(\/loader)?$/.test(path) &&
      value.indexOf(name) > -1
  );

const walk = function* (obj, query, parent = "", parents = []) {
  parents.unshift(obj);
  for (let key in obj) {
    const path = parent + "/" + key;
    const value = obj[key];
    const type = Array.isArray(value)
      ? "array"
      : Object.prototype.toString.call(value) === "[object Object]"
      ? "object"
      : typeof value;
    if (query(type, path, value)) {
      if (yield [path, value, ...parents]) return true;
    }
    if ((type === "array" || type === "object") && !parents.includes(value)) {
      if (yield* walk(value, query, path, parents)) return true;
    }
  }
  parents.pop();
};
