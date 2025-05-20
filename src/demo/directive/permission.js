import Vue from 'vue';
export const buttonPermissions = Vue.directive("permission", {
  inserted(el, binding) {
    let buttonKey = binding.value;
    console.log(buttonKey, "buttonKey");
    if (buttonKey) {
      let key = checkKey(buttonKey);
      if (!key) {
        el.remove();
      }
    } else {
      throw new Error($t("缺少绑定的code指令"));
    }
  },
});

/**
 * 
 * @param {*} key 传递code码,一般是页面:按钮 -> v-permission="'page-a:btn-update'"
 * @returns Boolean
 */
function checkKey(key) {
  let permissionData = JSON.parse(
    sessionStorage.getItem("permissionData") || "[]"
  );
  //permissionData为扁平的[]结构，暂时不用递归查找
  return permissionData.some((item) => item.htmlCode === key);
}
