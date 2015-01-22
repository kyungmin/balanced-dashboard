`import Ember from "ember";`
`import Computed from "balanced-dashboard/utils/computed";`

IntroPageView = Ember.View.extend(
	layoutName: "results/intro-page"
	classNames: ["intro-page"]
	iconClassName: Computed.fmt('iconName', 'icon-%@ non-interactive'),
)

`export default IntroPageView;`
