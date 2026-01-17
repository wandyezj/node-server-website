const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const devCerts = require("office-addin-dev-certs");

// Options

/**
 * In Dev mode, when starting, open the edit, run, and blocks in the browser
 */
const optionDevOpenBrowserTabs = true;
const optionOpenBrowserTabs = ["/index.html"];

async function getHttpsOptions() {
    const options = await devCerts.getHttpsServerOptions();
    return options;
}

const path = require("path");
module.exports = async (env, options) => {
    //console.log(env);

    const isDevelopment = options.mode === "development";
    const config = {
        // no source maps for production
        devtool: isDevelopment ? "inline-source-map" : undefined,

        // Ignore file size violation hints
        performance: {
            hints: false,
        },
        devServer: {
            static: {
                directory: path.join(__dirname, "..", "dist"),
            },
        },
        entry: {
            index: "./src/index.tsx",
        },
        output: {
            // Add contenthash to cache bust on CDN
            filename: isDevelopment ? "[name].bundle.js" : "[name].bundle-[contenthash].js",
            path: path.resolve(__dirname, "..", "dist"),
        },
        optimization: {
            runtimeChunk: "single",
            splitChunks: {
                chunks: "all",
            },
        },
        resolve: {
            extensions: [".ts", ".json", ".js", ".tsx"],
        },

        module: {
            rules: [
                {
                    test: /\.css$/i,
                    use: ["style-loader", "css-loader"],
                },
                {
                    test: /\.(png|jpg|jpeg|gif)$/,
                    use: "assets/resource",
                },
                {
                    test: /\.(ts|tsx)$/,
                    loader: "ts-loader",
                },
            ],
        },
        plugins: [
            new CleanWebpackPlugin(),
            new HtmlWebpackPlugin({
                template: "src/index.html",
                filename: "index.html",
                chunks: ["index"],
            }),
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: "./src/robots.txt",
                        to: "robots.txt",
                    },
                ],
            }),
        ],
    };

    //Only need to configure webserver in development mode
    if (options.mode === "development") {
        config.devServer = {
            ...config.devServer,
            open: optionDevOpenBrowserTabs ? optionOpenBrowserTabs : [],
            port: 3000,
            server: {
                type: "https",
                options: await getHttpsOptions(),
            },
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
        };
    }

    return config;
};
