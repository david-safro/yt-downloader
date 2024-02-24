<nav class="navbar">
    <div class="left"><a href="/" style="text-decoration: none; color: whitesmoke">Made by David S</a></div>
    <div class="right">
        <a href="https://github.com/david-safro/" target="_blank" class="icon-link"><img src="https://upload.wikimedia.org/wikipedia/commons/c/c2/GitHub_Invertocat_Logo.svg" alt="github" style="width: 40px; height: auto"/></a>
        <a href="https://stackoverflow.com/users/13794936/david-safro" target="_blank" class="icon-link"><img src="https://upload.wikimedia.org/wikipedia/commons/e/ef/Stack_Overflow_icon.svg" alt="Stack Overflow" style="width: 40px; height: auto"/></a>
        <a href="https://discord.com/invite/jr66n5Td" target="_blank" class="icon-link"><img src="https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a69f118df70ad7828d4_icon_clyde_blurple_RGB.svg" alt="discord" style="width: 40px; height: auto"/></a>
        <a href="https://paypal.me/davidsafro" target="_blank" class="icon-link"><img src="https://upload.wikimedia.org/wikipedia/commons/b/b7/PayPal_Logo_Icon_2014.svg" alt="PayPal" style="width: 30px; height: auto"/></a>
    </div>
</nav>

<slot />

<style>
    .navbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem 1rem;
        background-color: #333;
        height: 3rem;
    }

    .left, .right {
        display: flex;
        align-items: center;
    }

    .icon-link {
        margin: 0 0.5rem;
        font-size: 1.5rem;
        color: white;
        text-decoration: none;
    }

    .icon-link:hover {
        color: #ddd;
    }
</style>
