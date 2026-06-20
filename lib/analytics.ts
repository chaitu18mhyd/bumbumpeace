/**
 * Google Analytics event tracking utility
 * Provides a consistent, type-safe way to track user interactions across the app
 */

export interface AnalyticsEvent {
  eventName: string;
  properties?: Record<string, string | number | boolean>;
}

/**
 * Track a user interaction event to Google Analytics
 * @param eventName - Name of the event (e.g., "filter_by_region")
 * @param properties - Optional event properties/metadata
 */
export function trackEvent(eventName: string, properties?: Record<string, string | number | boolean>) {
  if (typeof window === "undefined") return;
  
  const gtag = (window as any).gtag;
  if (!gtag) return;

  gtag("event", eventName, properties);
}

/**
 * Track filter changes
 */
export function trackFilterChange(
  filterType: "region" | "tags" | "search",
  value: string
) {
  trackEvent("filter_change", {
    filter_type: filterType,
    filter_value: value,
  });
}

/**
 * Track city pin/unpin actions
 */
export function trackCityPin(action: "pin" | "unpin", city: string, country: string) {
  trackEvent("city_pin", {
    action,
    city,
    country,
  });
}

/**
 * Track compare panel interactions
 */
export function trackComparePanel(action: "open" | "close" | "unpin_from_compare") {
  trackEvent("compare_panel", {
    action,
  });
}

/**
 * Track pagination
 */
export function trackPagination(page: number, totalResults: number) {
  trackEvent("load_more_cities", {
    current_page: page,
    total_results: totalResults,
  });
}

/**
 * Track feature request submission
 */
export function trackFeatureRequest(title: string) {
  trackEvent("feature_request_submitted", {
    title_length: title.length,
  });
}

/**
 * Track mobile menu toggle
 */
export function trackMobileMenuToggle(action: "open" | "close") {
  trackEvent("mobile_menu_toggle", {
    action,
  });
}

/**
 * Track budget/filters reset
 */
export function trackClearFilters() {
  trackEvent("clear_filters");
}

/**
 * Track currency change
 */
export function trackCurrencyChange(currency: string) {
  trackEvent("currency_change", {
    currency,
  });
}

/**
 * Track budget adjustment
 */
export function trackBudgetAdjustment(budgetUsd: number) {
  trackEvent("budget_adjustment", {
    budget_usd: budgetUsd,
  });
}
