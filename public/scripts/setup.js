(function() {
    var Setup = {
        $el: null,
        gameList: null,
        game: null,

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
        requestToJoinGame: function(hostId, playerId) {
            $.ajax({
                url: '/game',
                method: 'POST',
                dataType: 'json',
                data: { action: 'JOIN', hostId: hostId, playerId: playerId }
            }).done(function(response) {
                this.setGameList(response.gameList);
                this.initializeGame(playerId, hostId);
            }.bind(this)).fail(function(response) {
                response = JSON.parse(response.responseText);
                this.setGameList(response.gameList);
                alert(response.message);
            }.bind(this));
        },
        initializeGame: function(playerId, opponentId) {
            var controller = new Controller();
            var player = new Player(playerId, controller);
            var opponent = new Player(opponentId, null);
            this.game = new Game(player, opponent);
            
            this.hide();
            this.game.init();
        },
        show: function() {
            this.$el.show();
        },
        hide: function() {
            this.$el.hide();
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
                        '<tr><td class=\'hostId\'>' + 
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
            var hostId = $(e.target).parent().find('.hostId').text();
            this.requestToJoinGame(hostId, 'SSOE');
        },
        onRefresh: function() {
            this.refreshGameList();
        }
    };

    Setup.init();
})();