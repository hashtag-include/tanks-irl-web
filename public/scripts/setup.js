(function() {
    var Setup = {
        $el: null,
        gameList: null,

        init: function() {
            this.$el = $('.setup');

            this.bindEvents();
        },
        bindEvents: function() {
            this.$el.find('.section-start').on('click', '.join', this.onJoin.bind(this));
            this.$el.find('.section-start').on('click', '.host', this.onHost.bind(this));

            this.$el.find('.section-join .game-list').on('click', '.connect', this.onConnect.bind(this));
            this.$el.find('.section-join .game-list').on('click', '.refresh', this.onRefresh.bind(this));
        },
        refreshGameList: function() {
            $.ajax({
                url: '/game',
                method: 'GET',
                dataType: 'json'
            }).done(function(gameList) {
                this.setGameList(gameList);
            }.bind(this));
        },
        joinGame: function(hostname) {
            $.ajax({
                url: '/game',
                method: 'POST',
                dataType: 'json',
                data: { host: hostname, opponent: 'TODO' } //TODO
            }).done(function(response) {
                console.log(response);
            }.bind(this)).fail(function(response) {
                response = JSON.parse(response.responseText);
                this.setGameList(response.gameList);
                alert(response.message);
            }.bind(this));
        },

        // Getters and Setters
        getGameList: function() {
            return this.gameList;
        },
        setGameList: function(gameList) {
            this.gameList = gameList;

            this.$el.find('.section-join .game-list tbody').empty();

            for(var i = 0; i < gameList.sessions.length; i++) {
                if(gameList.sessions[i].opponent == null) {
                    this.$el.find('.section-join .game-list tbody').append(
                        '<tr><td class=\'hostname\'>' + 
                        gameList.sessions[i].host.id + 
                        '</td><td class=\'connect\'>Connect</td></tr>'
                    );
                }
            }
        },
        
        // Events
        onJoin: function() {
            this.$el.find('.section-start').fadeOut();
            this.$el.find('.section-join').fadeIn();

            this.refreshGameList();
        },
        onHost: function() {
            this.$el.find('.section-start').fadeOut();
            this.$el.find('.section-host').fadeIn();
        },
        onConnect: function(e) {
            var hostname = $(e.target).parent().find('.hostname').text();
            this.joinGame(hostname);
        },
        onRefresh: function() {
            this.refreshGameList();
        }
    };

    Setup.init();
})();