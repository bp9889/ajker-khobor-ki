// The AJKER খবর KI? Android app: a full-screen WebView around the live site, with its own splash,
// loading animation and offline screen. Same package name as the first (TWA) app, so it installs as an update.
plugins { id("com.android.application") }

android {
    namespace = "com.ajkerkhoborki.app"
    compileSdk = 35
    defaultConfig {
        applicationId = "app.vercel.ajker_khobor_ki.twa"
        minSdk = 24
        targetSdk = 34
        versionCode = 2
        versionName = "2.0"
    }
    buildTypes { release { isMinifyEnabled = false } }
    compileOptions { sourceCompatibility = JavaVersion.VERSION_17; targetCompatibility = JavaVersion.VERSION_17 }
}

dependencies {
    implementation("androidx.swiperefreshlayout:swiperefreshlayout:1.1.0")
}
