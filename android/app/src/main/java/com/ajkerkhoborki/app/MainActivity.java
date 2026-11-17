package com.ajkerkhoborki.app;

import android.animation.ObjectAnimator;
import android.animation.ValueAnimator;
import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.Bundle;
import android.view.View;
import android.view.animation.AccelerateDecelerateInterpolator;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.ProgressBar;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

/**
 * The app: the live AJKER খবর KI? site in a full-screen WebView (no browser bar), with a kite loading screen,
 * pull to refresh, a no-internet screen, and links to other websites opened in the phone's browser.
 * APP_VERSION must match "apkVersion" in data/app.json on the site, which uses it to offer updates.
 */
public class MainActivity extends Activity {
    static final String HOST = "ajker-khobor-ki.vercel.app";
    static final int APP_VERSION = 2;
    static final String HOME = "https://" + HOST + "/?source=app&av=" + APP_VERSION;

    WebView web;
    View loader, offline, kite;
    ProgressBar bar;
    SwipeRefreshLayout refresh;
    boolean firstDone = false, failed = false;
    ObjectAnimator bob, tilt;

    @Override
    protected void onCreate(Bundle saved) {
        setTheme(R.style.Theme_Ajker);
        super.onCreate(saved);
        setContentView(R.layout.activity_main);
        web = findViewById(R.id.web);
        loader = findViewById(R.id.loader);
        offline = findViewById(R.id.offline);
        kite = findViewById(R.id.kite);
        bar = findViewById(R.id.bar);
        refresh = findViewById(R.id.refresh);
        refresh.setColorSchemeColors(0xFFD21F14, 0xFFFFD400);
        refresh.setOnRefreshListener(() -> web.reload());
        findViewById(R.id.retry).setOnClickListener(v -> { failed = false; offline.setVisibility(View.GONE); showLoader(); web.reload(); });

        float d = getResources().getDisplayMetrics().density;
        bob = ObjectAnimator.ofFloat(kite, "translationY", -10 * d, 10 * d);
        tilt = ObjectAnimator.ofFloat(kite, "rotation", -7f, 7f);
        for (ObjectAnimator a : new ObjectAnimator[] { bob, tilt }) {
            a.setDuration(a == bob ? 1100 : 1500);
            a.setRepeatMode(ValueAnimator.REVERSE);
            a.setRepeatCount(ValueAnimator.INFINITE);
            a.setInterpolator(new AccelerateDecelerateInterpolator());
            a.start();
        }

        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setDatabaseEnabled(true);
        s.setLoadWithOverviewMode(true);
        s.setUseWideViewPort(true);
        s.setSupportZoom(false);
        s.setMediaPlaybackRequiresUserGesture(false);
        s.setUserAgentString(s.getUserAgentString() + " AjkerKhoborApp/" + APP_VERSION);
        web.setOverScrollMode(View.OVER_SCROLL_NEVER);

        web.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest req) {
                Uri u = req.getUrl();
                if ("https".equals(u.getScheme()) && HOST.equals(u.getHost()) && !u.getPath().endsWith(".apk")) return false;
                openOutside(u);
                return true;
            }
            @Override
            public void onPageStarted(WebView view, String url, Bitmap icon) {
                if (firstDone) { bar.setProgress(5); bar.setVisibility(View.VISIBLE); }
            }
            @Override
            public void onPageFinished(WebView view, String url) {
                refresh.setRefreshing(false);
                bar.setVisibility(View.GONE);
                if (!failed) { offline.setVisibility(View.GONE); hideLoader(); }
            }
            @Override
            public void onReceivedError(WebView view, WebResourceRequest req, WebResourceError err) {
                if (req.isForMainFrame()) {
                    failed = true;
                    refresh.setRefreshing(false);
                    offline.setVisibility(View.VISIBLE);
                    hideLoader();
                }
            }
        });
        web.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onProgressChanged(WebView view, int p) {
                if (firstDone) bar.setProgress(Math.max(5, p));
                // Show the page once most of it is ready, so the loading screen never lingers.
                if (!firstDone && p >= 80 && !failed) hideLoader();
            }
        });
        // The "Download the update" button: let the phone's browser download the new app file.
        web.setDownloadListener((url, ua, cd, mime, len) -> openOutside(Uri.parse(url)));

        if (saved != null) web.restoreState(saved);
        else web.loadUrl(startUrl(getIntent()));
    }

    String startUrl(Intent i) {
        Uri u = i != null ? i.getData() : null;
        if (u != null && HOST.equals(u.getHost())) {
            String q = u.getQuery();
            return u.toString() + (q == null ? "?" : "&") + "source=app&av=" + APP_VERSION;
        }
        return HOME;
    }

    @Override
    protected void onNewIntent(Intent i) {
        super.onNewIntent(i);
        if (i != null && i.getData() != null) web.loadUrl(startUrl(i));
    }

    void showLoader() { loader.setAlpha(1f); loader.setVisibility(View.VISIBLE); }

    void hideLoader() {
        if (firstDone) return;
        firstDone = true;
        loader.animate().alpha(0f).setDuration(350).withEndAction(() -> {
            loader.setVisibility(View.GONE);
            bob.cancel();
            tilt.cancel();
        }).start();
    }

    void openOutside(Uri u) {
        try {
            Intent i = new Intent(Intent.ACTION_VIEW, u);
            if ("intent".equals(u.getScheme())) i = Intent.parseUri(u.toString(), Intent.URI_INTENT_SCHEME);
            i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            startActivity(i);
        } catch (ActivityNotFoundException | java.net.URISyntaxException e) {
            // No app can open it; stay on the page.
        }
    }

    @Override
    protected void onSaveInstanceState(Bundle out) { super.onSaveInstanceState(out); web.saveState(out); }

    @Override
    public void onBackPressed() {
        if (offline.getVisibility() == View.VISIBLE) { super.onBackPressed(); return; }
        if (web.canGoBack()) web.goBack(); else super.onBackPressed();
    }

    @Override
    protected void onResume() { super.onResume(); web.onResume(); }

    @Override
    protected void onPause() { web.onPause(); super.onPause(); }
}
