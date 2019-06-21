import { ApplicationInsights } from '@microsoft/applicationinsights-web'

/*
  Example traces:

    // Will get written to pageViews in App Insights
    appInsights.trackPageView({name: 'CarpoolDetailsPage'});

    // Will get written to customEvents in App Insights
    appInsights.trackEvent({name: 'The LanderPage was loaded'});
*/

export const appInsights = new ApplicationInsights({ config: {
  instrumentationKey: '8ae16ea3-a81e-4419-a8fb-84b62620f12a'
} });