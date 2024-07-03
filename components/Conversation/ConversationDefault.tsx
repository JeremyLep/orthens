export const ConversationDefault = ({user}) => {
    return (
        <div className="h-full flex items-center">
            <div className="mx-auto text-center">
                <div className="w-16 h-16 flex-none image-fit rounded-full overflow-hidden mx-auto">
                    {user && (
                        <img height={30} width={30} src={user?.image ?? `https://ui-avatars.com/api/?name=${user?.name}&format=svg&rounded=true`}/>
                    )}
                </div>
                <div className="mt-3">
                    <div className="font-medium">Bonjour !</div>
                    <div className="text-gray-600 mt-1">Sélectionner une conversation dans votre menu de gauche </div>
                </div>
            </div>
        </div>
    );
}